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
      if (this.isSubscriptinoActive(subscription)) {
         return subscription!.plan.tier;
      }

      // subscription cancelled - within grace period
      if (this.isSubscriptionWithiGracePeriod(subscription)) {
         return subscription!.plan.tier;
      }

      const user = await this.userService.getUserInternalById(userId);

      // trial active
      if (user?.trialEndsAt && isFuture(user.trialEndsAt)) {
         return "PRO";
      }

      return "FREE";
   }

   async hasActiveAccess(userId: string): Promise<boolean> {
      const subscription = await this.subscriptionRepo.pGetSubscription({
         userId,
      });

      // subscription active
      if (this.isSubscriptinoActive(subscription)) {
         return true;
      }

      // subscription cancelled - within grace period
      if (this.isSubscriptionWithiGracePeriod(subscription)) {
         return true;
      }

      const user = await this.userService.getUserInternalById(userId);

      // trial active
      if (user?.trialEndsAt && isFuture(user.trialEndsAt)) {
         return true;
      }

      // user has chosen a plan (incl. FREE after trial)
      if (user?.planChosenAt) {
         return true;
      }

      // trial expired and no plan chosen
      return false;
   }

   /**
    * Returns the current trial status for a user.
    * isActive = false if the trial has expired, the user has an active
    * subscription, or no trial was ever started.
    */
   async getTrialStatus(userId: string): Promise<DTrialStatus> {
      const user = await this.userService.getUserInternalById(userId);

      if (!user?.trialEndsAt) {
         return { isActive: false, daysLeft: 0, endsAt: null };
      }

      const trialEndsAt = user.trialEndsAt;

      if (!isFuture(trialEndsAt)) {
         return { isActive: false, daysLeft: 0, endsAt: trialEndsAt };
      }

      // Don't show trial banner if user already has an active paid subscription
      const subscription = await this.subscriptionRepo.pGetSubscription({
         userId,
      });
      if (subscription?.status === "ACTIVE") {
         return { isActive: false, daysLeft: 0, endsAt: trialEndsAt };
      }

      const daysLeft = Math.max(0, differenceInDays(trialEndsAt, new Date()));
      return { isActive: true, daysLeft, endsAt: trialEndsAt };
   }

   /** Set that the user has chosen a plan (including FREE). */
   async setPlanChosen(userId: string): Promise<void> {
      await this.userService.updatePlanChosenAt(userId, new Date());
   }

   isSubscriptinoActive(subscription: DSubscription | null): boolean {
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
