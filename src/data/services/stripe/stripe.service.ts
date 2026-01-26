import { isEmpty } from "es-toolkit/compat";

import { requireUser } from "@/data/actions/auth-utils";
import { CartService } from "@/data/services/cart";
import { OrderService } from "@/data/services/order";
import { DOrderUpdate } from "@/data/types/domain/order";
import {
   DBillingInterval,
   DSubscriptionCheckoutResult,
   DSubscriptionUpdate,
} from "@/data/types/domain/subscription";
import { APP_URL } from "@/lib/constants";
import { stripe } from "@/lib/stripe/stripe-server";
import { SubscriptionService } from "../subscription";

import { toStripePriceUnit } from "./utils";

type CheckoutResponse = {
   sessionId: string;
   url: string;
};

export class StripeService {
   private cartService: CartService;
   private orderService: OrderService;
   private subscriptionService: SubscriptionService;

   constructor(
      cartService: CartService,
      orderService: OrderService,
      subscriptionService: SubscriptionService
   ) {
      this.cartService = cartService;
      this.orderService = orderService;
      this.subscriptionService = subscriptionService;
   }

   async createOrderCheckoutSession(): Promise<CheckoutResponse> {
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
   }): Promise<DSubscriptionCheckoutResult> {
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

      const checkoutSession = await stripe.checkout.sessions.create({
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
      });

      const subscriptionData: DSubscriptionUpdate = {
         userId: userId,
         planId: planId,
         billingInterval: billingInterval,
         tier: plan.tier,
         stripeCheckoutSessionId: checkoutSession.id,
         stripeCustomerId,
      };
      await this.subscriptionService.createUserSubscription(subscriptionData);

      return {
         sessionId: checkoutSession.id,
         url: checkoutSession.url!,
      };
   }

   async getOrCreateStripeCustomer(
      userId: string,
      email: string
   ): Promise<string> {
      // Check if user already has a Stripe customer ID
      const subscription =
         await this.subscriptionRepo.pGetUserSubscription(userId);

      if (subscription?.stripeCustomerId) {
         return subscription.stripeCustomerId;
      }

      // Check user table for existing customer ID
      const user =
         await this.subscriptionRepo.pGetUserByStripeCustomerId(userId);

      // If user has stripeCustomerId in User table, return it
      // This requires getting the user differently - we'll create the customer

      // Create new Stripe customer
      const customer = await stripe.customers.create({
         email,
         metadata: {
            userId,
         },
      });

      // Update user with Stripe customer ID
      await this.subscriptionRepo.pUpdateUserStripeCustomerId(
         userId,
         customer.id
      );

      return customer.id;
   }
}
