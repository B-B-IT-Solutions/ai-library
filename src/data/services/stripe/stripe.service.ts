import { isEmpty } from "es-toolkit/compat";
import Stripe from "stripe";

import { requireUser } from "@/data/actions/auth-utils";
import { CartService } from "@/data/services/cart";
import { OrderService } from "@/data/services/order";
import { SubscriptionService } from "@/data/services/subscription";
import { UserService } from "@/data/services/user";
import { DOrderUpdate } from "@/data/types/domain/order";
import {
   DStripeBillingPortalSessionResponse,
   DStripeCheckoutResponse,
} from "@/data/types/domain/stripe";
import {
   DBillingInterval,
   DSubscriptionCreate,
   DSubscriptionHistoryCreate,
   DSubscriptionUpdate,
} from "@/data/types/domain/subscription";
import { APP_URL } from "@/lib/constants";
import { stripe } from "@/lib/stripe/stripe-server";

import { mapStripeStatus, toStripePriceUnit } from "./utils";

export class StripeService {
   private cartService: CartService;
   private orderService: OrderService;
   private subscriptionService: SubscriptionService;
   private userService: UserService;

   constructor(
      cartService: CartService,
      orderService: OrderService,
      subscriptionService: SubscriptionService,
      userService: UserService
   ) {
      this.cartService = cartService;
      this.orderService = orderService;
      this.subscriptionService = subscriptionService;
      this.userService = userService;
   }

   async createOrderCheckoutSession(): Promise<DStripeCheckoutResponse> {
      const user = await requireUser();
      const cart = await this.cartService.getCart();

      if (isEmpty(cart.items)) {
         throw new Error("Your cart is empty.");
      }

      const order = await this.orderService.createOrder(user.id, cart);

      const lineItems = cart.items.map((item) => ({
         price_data: {
            currency: "chf",
            product_data: {
               name: item.productName,
               description: item.productDescription,
            },
            unit_amount: toStripePriceUnit(item),
         },
         quantity: item.quantity,
      }));

      const checkoutSession = await stripe.checkout.sessions.create({
         mode: "payment",
         payment_method_types: ["card"],
         line_items: lineItems,
         customer_email: user.email || undefined,
         client_reference_id: order.id,
         metadata: {
            orderId: order.id,
            userId: user.id,
         },
         success_url: `${APP_URL}/orders/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${APP_URL}/checkout?canceled=true`,
      });

      const dUpdate: DOrderUpdate = {
         stripeCheckoutSessionId: checkoutSession.id,
         stripePaymentStatus: "unpaid",
      };
      await this.orderService.updateOrder(order.id, dUpdate);

      return {
         sessionId: checkoutSession.id,
         url: checkoutSession.url!,
      };
   }

   async createSubscriptionCheckoutSession(params: {
      userId: string;
      userEmail: string;
      planId: string;
      billingInterval: DBillingInterval;
   }): Promise<DStripeCheckoutResponse> {
      const { userId, userEmail, planId, billingInterval } = params;

      const plan = await this.subscriptionService.getPlanById(planId);

      const stripePriceId =
         billingInterval === "MONTHLY"
            ? plan.stripePriceIdMonthly
            : plan.stripePriceIdYearly;

      if (!stripePriceId) {
         throw new Error(
            `No Stripe price configured for ${billingInterval} billing`
         );
      }

      const stripeCustomerId = await this.getOrCreateStripeCustomer(
         userId,
         userEmail
      );

      // Check for existing incomplete subscription and delete it
      const existingSubscription =
         await this.subscriptionService.getSubscription(userId);
      if (
         existingSubscription &&
         existingSubscription.status === "INCOMPLETE"
      ) {
         await this.subscriptionService.deleteSubscription(userId);
      }

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
         mode: "subscription",
         payment_method_types: ["card"],
         line_items: [
            {
               price: stripePriceId,
               quantity: 1,
            },
         ],
         customer: stripeCustomerId,
         client_reference_id: params.userId,
         metadata: {
            userId: params.userId,
            planId: params.planId,
            billingInterval: params.billingInterval,
         },
         success_url: `${APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${APP_URL}/subscription/pricing`,
         subscription_data: {
            metadata: {
               userId: params.userId,
               planId: params.planId,
            },
         },
      };
      const session = await stripe.checkout.sessions.create(sessionParams);

      const subscriptionData: DSubscriptionCreate = {
         userId: userId,
         planId: planId,
         billingInterval: billingInterval,
         tier: plan.tier,
         stripeCheckoutSessionId: session.id,
         stripeCustomerId,
      };
      await this.subscriptionService.createSubscription(subscriptionData);

      return {
         sessionId: session.id,
         url: session.url!,
      };
   }

   async cancelSubscription(userId: string): Promise<void> {
      const subscription =
         await this.subscriptionService.getSubscription(userId);

      if (!subscription) {
         throw new Error("No subscription found");
      }

      if (!subscription.stripeSubscriptionId) {
         throw new Error("No Stripe subscription found");
      }

      const stripeSubscriptionUpdate: Stripe.SubscriptionUpdateParams = {
         cancel_at_period_end: true,
      };
      await stripe.subscriptions.update(
         subscription.stripeSubscriptionId,
         stripeSubscriptionUpdate
      );

      const subscriptionUpdate: DSubscriptionUpdate = {
         cancelAtPeriodEnd: true,
         canceledAt: new Date(),
      };
      await this.subscriptionService.updateSubscription(
         userId,
         subscriptionUpdate
      );

      const historyCreate: DSubscriptionHistoryCreate = {
         userId,
         eventType: "canceled",
         fromStatus: subscription.status,
         toStatus: subscription.status,
         metadata: {
            cancelAtPeriodEnd: true,
            currentPeriodEnd: subscription.currentPeriodEnd,
         },
      };
      await this.subscriptionService.createSubscriptionHistory(historyCreate);
   }

   async reactivateSubscription(userId: string): Promise<void> {
      const subscription =
         await this.subscriptionService.getSubscription(userId);

      if (!subscription) {
         throw new Error("No subscription found");
      }

      if (!subscription.stripeSubscriptionId) {
         throw new Error("No Stripe subscription found");
      }

      if (!subscription.cancelAtPeriodEnd) {
         throw new Error("Subscription is not set to cancel");
      }

      const stripeSubscriptionUpdate: Stripe.SubscriptionUpdateParams = {
         cancel_at_period_end: false,
      };
      await stripe.subscriptions.update(
         subscription.stripeSubscriptionId,
         stripeSubscriptionUpdate
      );

      const subscriptionUpdate: DSubscriptionUpdate = {
         cancelAtPeriodEnd: false,
         canceledAt: null,
      };
      await this.subscriptionService.updateSubscription(
         userId,
         subscriptionUpdate
      );

      const historyCreate: DSubscriptionHistoryCreate = {
         userId,
         eventType: "reactivated",
         fromStatus: subscription.status,
         toStatus: subscription.status,
         metadata: {
            cancelAtPeriodEnd: false,
         },
      };
      await this.subscriptionService.createSubscriptionHistory(historyCreate);
   }

   async handleSubscriptionCheckoutCompleted(session: Stripe.Checkout.Session) {
      const userId = session.metadata?.userId;
      const stripeSubscriptionId = session.subscription as string;

      if (!userId || !stripeSubscriptionId) {
         throw new Error("Missing userId or subscription in checkout session");
      }

      const stripeSubscription =
         await stripe.subscriptions.retrieve(stripeSubscriptionId);

      const subscriptionUpdate: DSubscriptionUpdate = {
         status: mapStripeStatus(stripeSubscription.status),
         stripeSubscriptionId: stripeSubscription.id,
         stripeCustomerId: stripeSubscription.customer as string,
         currentPeriodStart: new Date(
            stripeSubscription.items.data[0].current_period_start * 1000
         ),
         currentPeriodEnd: new Date(
            stripeSubscription.items.data[0].current_period_end * 1000
         ),
      };

      await this.subscriptionService.updateSubscription(
         userId,
         subscriptionUpdate
      );

      const subscription =
         await this.subscriptionService.getSubscription(userId);

      const historyCreate: DSubscriptionHistoryCreate = {
         userId,
         eventType: "activated",
         fromStatus: "INCOMPLETE",
         toStatus: mapStripeStatus(stripeSubscription.status),
         toTier: subscription?.plan.tier,
         stripeEventId: session.id,
      };
      await this.subscriptionService.createSubscriptionHistory(historyCreate);
   }

   async handleSubscriptionUpdated(
      stripeSubscription: Stripe.Subscription
   ): Promise<void> {
      const userId = stripeSubscription.metadata?.userId;

      if (!userId) {
         // Try to find subscription by Stripe ID
         const subscription =
            await this.subscriptionRepo.pGetSubscriptionByStripeSubscriptionId(
               stripeSubscription.id
            );

         if (!subscription) {
            console.error("Subscription not found for update");
            return;
         }
      }

      const localSubscription = userId
         ? await this.subscriptionRepo.pGetSubscription({ userId })
         : await this.subscriptionRepo.pGetSubscriptionByStripeSubscriptionId(
              stripeSubscription.id
           );

      if (!localSubscription) {
         console.error("Local subscription not found");
         return;
      }

      const oldStatus = localSubscription.status;
      const newStatus = this.mapStripeStatus(stripeSubscription.status);

      // Update subscription
      await this.subscriptionRepo.pUpdateSubscription(
         localSubscription.userId,
         {
            status: newStatus,
            currentPeriodStart: new Date(
               stripeSubscription.items.data[0].current_period_start * 1000
            ),
            currentPeriodEnd: new Date(
               stripeSubscription.items.data[0].current_period_end * 1000
            ),
            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
         }
      );

      // Create history entry if status changed
      if (oldStatus !== newStatus) {
         await this.subscriptionRepo.pCreateSubscriptionHistory({
            userId: localSubscription.userId,
            eventType: "updated",
            fromStatus: oldStatus,
            toStatus: newStatus,
            stripeEventId: stripeSubscription.id,
         });
      }
   }

   async createPortalSession(
      userId: string
   ): Promise<DStripeBillingPortalSessionResponse> {
      const subscription =
         await this.subscriptionService.getSubscription(userId);

      if (!subscription?.stripeCustomerId) {
         throw new Error("No active subscription found");
      }

      const session = await stripe.billingPortal.sessions.create({
         customer: subscription.stripeCustomerId,
         return_url: `${APP_URL}/settings/subscription`,
      });

      return {
         url: session.url,
      };
   }

   async getOrCreateStripeCustomer(
      userId: string,
      email: string
   ): Promise<string> {
      const stripeCustomerId =
         await this.userService.getUserStripeCustomerId(userId);

      if (stripeCustomerId) {
         return stripeCustomerId;
      }

      const data: Stripe.CustomerCreateParams = {
         email,
         metadata: {
            userId,
         },
      };
      const customer = await stripe.customers.create(data);

      await this.userService.updateUserStripeCustomerId(userId, customer.id);

      return customer.id;
   }
}
