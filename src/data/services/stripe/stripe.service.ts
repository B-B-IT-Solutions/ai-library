import { isEmpty } from "es-toolkit/compat";
import Stripe from "stripe";

import { requireUser } from "@/data/actions/auth-utils";
import { CartService } from "@/data/services/cart";
import { OrderService } from "@/data/services/order";
import { SubscriptionService } from "@/data/services/subscription";
import { UserService } from "@/data/services/user";
import { DOrderUpdate } from "@/data/types/domain/order";
import { DStripeCheckoutResponse } from "@/data/types/domain/stripe";
import {
   DBillingInterval,
   DSubscriptionCreate,
   DSubscriptionHistoryCreate,
   DSubscriptionUpdate,
} from "@/data/types/domain/subscription";
import { APP_URL } from "@/lib/constants";
import { stripe } from "@/lib/stripe/stripe-server";

import { toStripePriceUnit } from "./utils";

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
         await this.subscriptionService.getUserSubscription(userId);
      if (
         existingSubscription &&
         existingSubscription.status === "INCOMPLETE"
      ) {
         await this.subscriptionService.deleteUserSubscription(userId);
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
      await this.subscriptionService.createUserSubscription(subscriptionData);

      return {
         sessionId: session.id,
         url: session.url!,
      };
   }

   async cancelSubscription(userId: string): Promise<void> {
      const subscription =
         await this.subscriptionService.getUserSubscription(userId);

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
      await this.subscriptionService.updateUserSubscription(
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
      await this.subscriptionService.createUserSubscriptionHistory(
         historyCreate
      );
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
         email: email,
         metadata: {
            userId,
         },
      };
      const customer = await stripe.customers.create(data);

      await this.userService.updateUserStripeCustomerId(userId, customer.id);

      return customer.id;
   }
}
