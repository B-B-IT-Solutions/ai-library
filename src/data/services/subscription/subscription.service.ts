import Stripe from "stripe";

import { SubscriptionRepository } from "@/data/repositories/subscription";
import {
   SubscriptionHistoryCreate,
   SubscriptionUpdate,
} from "@/data/types/db/subscription";
import {
   DSubscription,
   DSubscriptionCreate,
   DSubscriptionHistoryCreate,
   DSubscriptionPlan,
   DSubscriptionTier,
   DSubscriptionUpdate,
} from "@/data/types/domain/subscription";
import { SubscriptionStatus } from "@/generated/prisma/client";
import { stripe } from "@/lib/stripe/stripe-server";

import {
   toDSubscription,
   toDSubscriptionPlan,
   toDSubscriptionPlans,
} from "./subscription.mapper";

export class SubscriptionService {
   private subscriptionRepo: SubscriptionRepository;

   constructor(subscriptionRepo: SubscriptionRepository) {
      this.subscriptionRepo = subscriptionRepo;
   }

   async getAvailablePlans(): Promise<DSubscriptionPlan[]> {
      const plans = await this.subscriptionRepo.pGetAllPlans();
      return toDSubscriptionPlans(plans);
   }

   async getPlanByTier(
      tier: DSubscriptionTier
   ): Promise<DSubscriptionPlan | null> {
      const plan = await this.subscriptionRepo.pGetPlanByTier(tier);
      return plan ? toDSubscriptionPlan(plan) : null;
   }

   async getPlanById(planId: string): Promise<DSubscriptionPlan> {
      const plan = await this.subscriptionRepo.pGetPlanById(planId);

      if (!plan) {
         throw new Error("Subscription plan not found");
      }

      if (!plan.isActive) {
         throw new Error("This subscription plan is not available");
      }
      return toDSubscriptionPlan(plan);
   }

   async getSubscription(userId: string): Promise<DSubscription | null> {
      const subscription = await this.subscriptionRepo.pGetSubscription(userId);
      return subscription ? toDSubscription(subscription) : null;
   }

   async createSubscription(data: DSubscriptionCreate): Promise<void> {
      await this.subscriptionRepo.pCreateSubscription({
         userId: data.userId,
         planId: data.planId,
         billingInterval: data.billingInterval,
         stripeCheckoutSessionId: data.stripeCheckoutSessionId,
         stripeCustomerId: data.stripeCustomerId,
      });

      await this.subscriptionRepo.pCreateSubscriptionHistory({
         userId: data.userId,
         eventType: "checkout_created",
         toTier: data.tier,
         toStatus: "INCOMPLETE",
         metadata: {
            checkoutSessionId: data.stripeCheckoutSessionId,
            billingInterval: data.billingInterval,
         },
      });
   }

   async updateSubscription(
      userId: string,
      data: DSubscriptionUpdate
   ): Promise<void> {
      const updateData: SubscriptionUpdate = {
         cancelAtPeriodEnd: data.cancelAtPeriodEnd,
         canceledAt: data.canceledAt,
      };
      await this.subscriptionRepo.pUpdateSubscription(userId, updateData);
   }

   async deleteSubscription(userId: string): Promise<void> {
      await this.subscriptionRepo.pDeleteSubscription(userId);
   }

   async createSubscriptionHistory(
      data: DSubscriptionHistoryCreate
   ): Promise<void> {
      const createData: SubscriptionHistoryCreate = {
         userId: data.userId,
         eventType: data.eventType,
         fromStatus: data.fromStatus,
         toStatus: data.toStatus,
         metadata: data.metadata,
      };
      await this.subscriptionRepo.pCreateSubscriptionHistory(createData);
   }

   async getUserTier(userId: string): Promise<DSubscriptionTier> {
      const subscription = await this.subscriptionRepo.pGetSubscription(userId);

      if (subscription && subscription.status === "ACTIVE") {
         return subscription.plan.tier as DSubscriptionTier;
      }
      return "FREE";
   }

   async hasActiveAccess(userId: string): Promise<boolean> {
      const subscription = await this.subscriptionRepo.pGetSubscription(userId);

      if (!subscription) {
         return false;
      }

      // User has access if subscription is ACTIVE
      if (subscription.status === "ACTIVE") {
         return true;
      }

      // OR if subscription is CANCELED but still in grace period
      if (
         subscription.status === "CANCELED" &&
         subscription.currentPeriodEnd &&
         new Date(subscription.currentPeriodEnd) > new Date()
      ) {
         return true;
      }

      return false;
   }

   // async createCheckoutSession(params: {
   //    userId: string;
   //    userEmail: string;
   //    planId: string;
   //    billingInterval: DBillingInterval;
   //    successUrl?: string;
   //    cancelUrl?: string;
   // }): Promise<DStripeCheckoutResponse> {
   //    const plan = await this.subscriptionRepo.pGetPlanById(params.planId);

   //    if (!plan) {
   //       throw new Error("Subscription plan not found");
   //    }

   //    if (!plan.isActive) {
   //       throw new Error("This subscription plan is not available");
   //    }

   //    // Get the correct Stripe price ID based on billing interval
   //    const stripePriceId =
   //       params.billingInterval === "MONTHLY"
   //          ? plan.stripePriceIdMonthly
   //          : plan.stripePriceIdYearly;

   //    if (!stripePriceId) {
   //       throw new Error(
   //          `No Stripe price configured for ${params.billingInterval} billing`
   //       );
   //    }

   //    // Get or create Stripe customer
   //    const stripeCustomerId = await this.getOrCreateStripeCustomer(
   //       params.userId,
   //       params.userEmail
   //    );

   //    // Check for existing incomplete subscription and delete it
   //    const existingSubscription =
   //       await this.subscriptionRepo.pGetUserSubscription(params.userId);
   //    if (
   //       existingSubscription &&
   //       existingSubscription.status === "INCOMPLETE"
   //    ) {
   //       await this.subscriptionRepo.pDeleteSubscription(params.userId);
   //    }

   //    // Create Stripe checkout session
   //    const checkoutSession = await stripe.checkout.sessions.create({
   //       mode: "subscription",
   //       payment_method_types: ["card"],
   //       line_items: [
   //          {
   //             price: stripePriceId,
   //             quantity: 1,
   //          },
   //       ],
   //       customer: stripeCustomerId,
   //       client_reference_id: params.userId,
   //       metadata: {
   //          userId: params.userId,
   //          planId: params.planId,
   //          billingInterval: params.billingInterval,
   //       },
   //       success_url:
   //          params.successUrl ||
   //          `${APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
   //       cancel_url: params.cancelUrl || `${APP_URL}/subscription/pricing`,
   //       subscription_data: {
   //          metadata: {
   //             userId: params.userId,
   //             planId: params.planId,
   //          },
   //       },
   //    });

   //    // Create pending subscription record
   //    await this.subscriptionRepo.pCreateSubscription({
   //       userId: params.userId,
   //       planId: params.planId,
   //       billingInterval: params.billingInterval,
   //       stripeCheckoutSessionId: checkoutSession.id,
   //       stripeCustomerId,
   //    });

   //    // Create history entry
   //    await this.subscriptionRepo.pCreateHistory({
   //       userId: params.userId,
   //       eventType: "checkout_created",
   //       toTier: plan.tier,
   //       toStatus: "INCOMPLETE",
   //       metadata: {
   //          checkoutSessionId: checkoutSession.id,
   //          billingInterval: params.billingInterval,
   //       },
   //    });

   //    return {
   //       sessionId: checkoutSession.id,
   //       url: checkoutSession.url!,
   //    };
   // }

   // async cancelSubscription(userId: string): Promise<void> {
   //    const subscription =
   //       await this.subscriptionRepo.pGetUserSubscription(userId);

   //    if (!subscription) {
   //       throw new Error("No subscription found");
   //    }

   //    if (!subscription.stripeSubscriptionId) {
   //       throw new Error("No Stripe subscription found");
   //    }

   //    // Update Stripe subscription to cancel at period end
   //    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
   //       cancel_at_period_end: true,
   //    });

   //    // Update local subscription
   //    await this.subscriptionRepo.pUpdateSubscription(userId, {
   //       cancelAtPeriodEnd: true,
   //       canceledAt: new Date(),
   //    });

   //    // Create history entry
   //    await this.subscriptionRepo.pCreateHistory({
   //       userId,
   //       eventType: "canceled",
   //       fromStatus: subscription.status,
   //       toStatus: subscription.status,
   //       metadata: {
   //          cancelAtPeriodEnd: true,
   //          currentPeriodEnd: subscription.currentPeriodEnd,
   //       },
   //    });
   // }

   // async reactivateSubscription(userId: string): Promise<void> {
   //    const subscription =
   //       await this.subscriptionRepo.pGetUserSubscription(userId);

   //    if (!subscription) {
   //       throw new Error("No subscription found");
   //    }

   //    if (!subscription.stripeSubscriptionId) {
   //       throw new Error("No Stripe subscription found");
   //    }

   //    if (!subscription.cancelAtPeriodEnd) {
   //       throw new Error("Subscription is not set to cancel");
   //    }

   //    // Update Stripe subscription to NOT cancel at period end
   //    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
   //       cancel_at_period_end: false,
   //    });

   //    // Update local subscription
   //    await this.subscriptionRepo.pUpdateSubscription(userId, {
   //       cancelAtPeriodEnd: false,
   //       canceledAt: null,
   //    });

   //    // Create history entry
   //    await this.subscriptionRepo.pCreateHistory({
   //       userId,
   //       eventType: "reactivated",
   //       fromStatus: subscription.status,
   //       toStatus: subscription.status,
   //       metadata: {
   //          cancelAtPeriodEnd: false,
   //       },
   //    });
   // }

   // async createPortalSession(
   //    userId: string
   // ): Promise<DStripeBillingPortalSessionResponse> {
   //    const subscription =
   //       await this.subscriptionRepo.pGetUserSubscription(userId);

   //    if (!subscription?.stripeCustomerId) {
   //       throw new Error("No active subscription found");
   //    }

   //    const portalSession = await stripe.billingPortal.sessions.create({
   //       customer: subscription.stripeCustomerId,
   //       return_url: `${APP_URL}/settings/subscription`,
   //    });

   //    return {
   //       url: portalSession.url,
   //    };
   // }

   // Webhook Handlers

   async handleCheckoutCompleted(
      session: Stripe.Checkout.Session
   ): Promise<void> {
      const userId = session.metadata?.userId;
      const stripeSubscriptionId = session.subscription as string;

      if (!userId || !stripeSubscriptionId) {
         throw new Error("Missing userId or subscription in checkout session");
      }

      // Get the Stripe subscription details
      const stripeSubscription =
         await stripe.subscriptions.retrieve(stripeSubscriptionId);

      // Update subscription with Stripe details
      await this.subscriptionRepo.pUpdateSubscription(userId, {
         status: this.mapStripeStatus(stripeSubscription.status),
         stripeSubscriptionId: stripeSubscription.id,
         stripeCustomerId: stripeSubscription.customer as string,
         currentPeriodStart: new Date(
            stripeSubscription.items.data[0].current_period_start * 1000
         ),
         currentPeriodEnd: new Date(
            stripeSubscription.items.data[0].current_period_end * 1000
         ),
      });

      const subscription = await this.subscriptionRepo.pGetSubscription(userId);

      // Create history entry
      await this.subscriptionRepo.pCreateSubscriptionHistory({
         userId,
         eventType: "activated",
         fromStatus: "INCOMPLETE",
         toStatus: this.mapStripeStatus(stripeSubscription.status),
         toTier: subscription?.plan.tier,
         stripeEventId: session.id,
      });
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
         ? await this.subscriptionRepo.pGetSubscription(userId)
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

   async handleSubscriptionDeleted(
      stripeSubscription: Stripe.Subscription
   ): Promise<void> {
      const subscription =
         await this.subscriptionRepo.pGetSubscriptionByStripeSubscriptionId(
            stripeSubscription.id
         );

      if (!subscription) {
         console.error("Subscription not found for deletion");
         return;
      }

      // Create history entry
      await this.subscriptionRepo.pCreateSubscriptionHistory({
         userId: subscription.userId,
         eventType: "expired",
         fromStatus: subscription.status,
         fromTier: subscription.plan.tier,
         stripeEventId: stripeSubscription.id,
      });

      // Delete local subscription
      await this.subscriptionRepo.pDeleteSubscription(subscription.userId);
   }

   async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
      const stripeSubscriptionId = invoice.subscription as string;

      console.log("handleInvoicePaymentSucceeded");

      if (!stripeSubscriptionId) {
         return;
      }

      const subscription =
         await this.subscriptionRepo.pGetSubscriptionByStripeSubscriptionId(
            stripeSubscriptionId
         );

      if (!subscription) {
         console.error("Subscription not found for invoice");
         return;
      }

      // Get the Stripe subscription to get updated period dates
      const stripeSubscription =
         await stripe.subscriptions.retrieve(stripeSubscriptionId);

      // Update subscription with new period
      await this.subscriptionRepo.pUpdateSubscription(subscription.userId, {
         status: "ACTIVE",
         currentPeriodStart: new Date(
            stripeSubscription.items.data[0].current_period_start * 1000
         ),
         currentPeriodEnd: new Date(
            stripeSubscription.items.data[0].current_period_end * 1000
         ),
      });

      // Create history entry
      await this.subscriptionRepo.pCreateSubscriptionHistory({
         userId: subscription.userId,
         eventType: "renewed",
         toStatus: "ACTIVE",
         stripeEventId: invoice.id,
         metadata: {
            invoiceId: invoice.id,
            amountPaid: invoice.amount_paid / 100,
         },
      });
   }

   async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
      const stripeSubscriptionId = invoice.subscription as string;

      if (!stripeSubscriptionId) {
         return;
      }

      const subscription =
         await this.subscriptionRepo.pGetSubscriptionByStripeSubscriptionId(
            stripeSubscriptionId
         );

      if (!subscription) {
         console.error("Subscription not found for failed invoice");
         return;
      }

      // Update subscription status to PAST_DUE
      await this.subscriptionRepo.pUpdateSubscription(subscription.userId, {
         status: "PAST_DUE",
      });

      // Create history entry
      await this.subscriptionRepo.pCreateSubscriptionHistory({
         userId: subscription.userId,
         eventType: "payment_failed",
         fromStatus: subscription.status,
         toStatus: "PAST_DUE",
         stripeEventId: invoice.id,
         metadata: {
            invoiceId: invoice.id,
            attemptCount: invoice.attempt_count,
         },
      });
   }

   // Helper Methods

   // async getOrCreateStripeCustomer(
   //    userId: string,
   //    email: string
   // ): Promise<string> {
   //    // Check if user already has a Stripe customer ID
   //    const subscription =
   //       await this.subscriptionRepo.pGetUserSubscription(userId);

   //    if (subscription?.stripeCustomerId) {
   //       return subscription.stripeCustomerId;
   //    }

   //    // Check user table for existing customer ID
   //    const user =
   //       await this.subscriptionRepo.pGetUserByStripeCustomerId(userId);

   //    // If user has stripeCustomerId in User table, return it
   //    // This requires getting the user differently - we'll create the customer

   //    // Create new Stripe customer
   //    const customer = await stripe.customers.create({
   //       email,
   //       metadata: {
   //          userId,
   //       },
   //    });

   //    // Update user with Stripe customer ID
   //    await this.subscriptionRepo.pUpdateUserStripeCustomerId(
   //       userId,
   //       customer.id
   //    );

   //    return customer.id;
   // }

   mapStripeStatus(
      stripeStatus: Stripe.Subscription.Status
   ): SubscriptionStatus {
      const statusMap: Record<Stripe.Subscription.Status, SubscriptionStatus> =
         {
            active: "ACTIVE",
            canceled: "CANCELED",
            incomplete: "INCOMPLETE",
            incomplete_expired: "INCOMPLETE",
            past_due: "PAST_DUE",
            unpaid: "UNPAID",
            trialing: "TRIALING",
            paused: "PAUSED",
         };

      return statusMap[stripeStatus] || "INCOMPLETE";
   }
}
