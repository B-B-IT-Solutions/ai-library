import { differenceInDays, isFuture } from "date-fns";

import { UserRepository } from "@/data/repositories/user";
import { SubscriptionRepository } from "@/data/repositories/subscription";
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
   private subscriptionRepo: SubscriptionRepository;
   private userRepo: UserRepository;

   constructor(
      subscriptionRepo: SubscriptionRepository,
      userRepo: UserRepository
   ) {
      this.subscriptionRepo = subscriptionRepo;
      this.userRepo = userRepo;
   }

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

      // Active subscription → use subscription tier
      if (subscription?.status === "ACTIVE") {
         return subscription.plan.tier;
      }

      // Cancelled subscription still within grace period → use subscription tier
      if (
         subscription?.status === "CANCELED" &&
         subscription.currentPeriodEnd &&
         isFuture(subscription.currentPeriodEnd)
      ) {
         return subscription.plan.tier;
      }

      // Check trial or planChosen on the user record
      const user = await this.userRepo.pGetUserById(userId);

      // Active trial → PRO access
      if (user?.trialEndsAt && isFuture(user.trialEndsAt)) {
         return "PRO";
      }

      // No active paid plan → FREE (covers planChosenAt = set and expired subscriptions)
      return "FREE";
   }

   async hasActiveAccess(userId: string): Promise<boolean> {
      const subscription = await this.subscriptionRepo.pGetSubscription({
         userId,
      });

      // Active subscription → access granted
      if (subscription?.status === "ACTIVE") {
         return true;
      }

      // Cancelled subscription still within grace period → access granted
      if (
         subscription?.status === "CANCELED" &&
         subscription.currentPeriodEnd &&
         isFuture(subscription.currentPeriodEnd)
      ) {
         return true;
      }

      const user = await this.userRepo.pGetUserById(userId);

      // Active trial → access granted
      if (user?.trialEndsAt && isFuture(user.trialEndsAt)) {
         return true;
      }

      // User has consciously chosen a plan (incl. FREE after trial) → access granted
      if (user?.planChosenAt) {
         return true;
      }

      // Trial expired and no plan chosen → show plan gate
      return false;
   }

   /**
    * Returns the current trial status for a user.
    * isActive = false if the trial has expired, the user has an active
    * subscription, or no trial was ever started.
    */
   async getTrialStatus(userId: string): Promise<DTrialStatus> {
      const user = await this.userRepo.pGetUserById(userId);

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

   /** Marks that the user has consciously chosen a plan (including FREE). */
   async setPlanChosen(userId: string): Promise<void> {
      await this.userRepo.pUpdateUser(userId, { planChosenAt: new Date() });
   }
}
