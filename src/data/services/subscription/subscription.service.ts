import { differenceInDays, isFuture } from "date-fns";

import { SubscriptionRepository } from "@/data/repositories/subscription";
import { UserService } from "@/data/services/user";
import {
   DSubscription,
   DSubscriptionCreate,
   DSubscriptionHistoryCreate,
   DSubscriptionPlan,
   DSubscriptionTier,
   DSubscriptionUpdate,
   DTrialStatus,
} from "@/data/types/domain/subscription";
import {
   canAccessFeature,
   FeatureName,
   getFeatureLimit,
   hasReachedLimit,
} from "@/lib/subscription/access-control";
import { SubscriptionAccessError } from "@/lib/subscription/server-guards";

export class SubscriptionService {
   constructor(
      private subscriptionRepo: SubscriptionRepository,
      private userService: UserService
   ) {}

   async getAvailablePlans(): Promise<DSubscriptionPlan[]> {
      return await this.subscriptionRepo.pGetAllPlans();
   }

   async getPlanByTier(
      tier: DSubscriptionTier
   ): Promise<DSubscriptionPlan | null> {
      return await this.subscriptionRepo.pGetPlanByTier(tier);
   }

   async getPlanById(planId: string): Promise<DSubscriptionPlan> {
      const plan = await this.subscriptionRepo.pGetPlanById(planId);

      if (!plan) {
         throw new Error("Subscription plan not found");
      }

      if (!plan.isActive) {
         throw new Error("This subscription plan is not available");
      }

      return plan;
   }

   async getSubscription(userId: string): Promise<DSubscription | null> {
      return await this.subscriptionRepo.pGetSubscription({
         userId,
      });
   }

   async getSubscriptionByStripeSubscriptionId(
      stripeSubscriptionId: string
   ): Promise<DSubscription | null> {
      return await this.subscriptionRepo.pGetSubscription({
         stripeSubscriptionId,
      });
   }

   async createSubscription(data: DSubscriptionCreate) {
      await this.subscriptionRepo.pCreateSubscription(data);
   }

   async updateSubscription(userId: string, data: DSubscriptionUpdate) {
      await this.subscriptionRepo.pUpdateSubscription(userId, data);
   }

   async deleteSubscription(userId: string) {
      await this.subscriptionRepo.pDeleteSubscription(userId);
   }

   async createSubscriptionHistory(data: DSubscriptionHistoryCreate) {
      await this.subscriptionRepo.pCreateSubscriptionHistory(data);
   }

   async getUserTier(userId: string): Promise<DSubscriptionTier> {
      const subscription = await this.subscriptionRepo.pGetSubscription({
         userId,
      });

      // subscription active
      if (this.isSubscriptionActive(subscription)) {
         return subscription!.plan.tier;
      }

      // subscription cancelled - within grace period
      if (this.isSubscriptionWithiGracePeriod(subscription)) {
         return subscription!.plan.tier;
      }

      const user = await this.userService.getUserInternalById(userId);

      // admins and promo users
      if (user?.role === "ADMIN" || user?.role === "PROMO_USER") {
         return "PRO";
      }

      // trial active
      if (user?.trialEndsAt && isFuture(user.trialEndsAt)) {
         return "PRO";
      }

      return "FREE";
   }

   /**
    * Returns the current trial status for a user.
    * isActive = false if the trial has expired, the user has an active subscription, or no trial was ever started.
    */
   async getTrialStatus(userId: string): Promise<DTrialStatus> {
      const user = await this.userService.getUserInternalById(userId);
      const { trialEndsAt } = user || {};

      if (!trialEndsAt) {
         return {
            isActive: false,
            daysLeft: 0,
            endsAt: null,
         };
      }

      if (!isFuture(trialEndsAt)) {
         return {
            isActive: false,
            daysLeft: 0,
            endsAt: trialEndsAt,
         };
      }

      // if user has an active paid subscription - there isn't any trial anymore
      const subscription = await this.subscriptionRepo.pGetSubscription({
         userId,
      });
      if (subscription?.status === "ACTIVE") {
         return {
            isActive: false,
            daysLeft: 0,
            endsAt: trialEndsAt,
         };
      }

      const daysLeft = Math.max(0, differenceInDays(trialEndsAt, new Date()));
      return {
         isActive: true,
         daysLeft,
         endsAt: trialEndsAt,
      };
   }

   /**
    * Checks whether the user has reached a count-based tier limit (e.g. maxPrompts).
    * Throws `SubscriptionAccessError` when the limit is reached
    */
   async requireCountLimit(
      userId: string,
      feature: FeatureName,
      currentCount: number
   ): Promise<void> {
      const tier = await this.getUserTier(userId);

      if (hasReachedLimit(tier, feature, currentCount)) {
         const limit = getFeatureLimit(tier, feature);
         throw new SubscriptionAccessError(
            `Limit erreicht: Dein Plan (${tier}) erlaubt maximal ${limit} Einträge für "${feature}". Bitte upgrade dein Abo.`,
            feature
         );
      }
   }

   /**
    * Checks whether the user's tier has access to a boolean tier feature (e.g.
    * canAccessVersionHistory). Throws `SubscriptionAccessError` when it doesn't.
    * Returns the resolved tier so callers can derive additional tier-dependent
    * values (e.g. a numeric limit) without a second lookup.
    */
   async requireFeatureAccess(
      userId: string,
      feature: FeatureName
   ): Promise<DSubscriptionTier> {
      const tier = await this.getUserTier(userId);

      if (!canAccessFeature(tier, feature)) {
         throw new SubscriptionAccessError(
            `Diese Funktion ist mit deinem aktuellen Plan (${tier}) nicht verfügbar. Bitte upgrade dein Abo.`,
            feature
         );
      }

      return tier;
   }

   isSubscriptionActive(subscription: DSubscription | null): boolean {
      return subscription?.status === "ACTIVE";
   }

   isSubscriptionWithiGracePeriod(subscription: DSubscription | null): boolean {
      return (
         subscription?.status === "CANCELED" &&
         !!subscription.currentPeriodEnd &&
         isFuture(subscription.currentPeriodEnd)
      );
   }
}
