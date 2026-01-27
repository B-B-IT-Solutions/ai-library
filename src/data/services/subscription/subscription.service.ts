import { SubscriptionRepository } from "@/data/repositories/subscription";
import {
   SubscriptionCreate,
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
      const subscription = await this.subscriptionRepo.pGetSubscription({
         userId,
      });
      return subscription ? toDSubscription(subscription) : null;
   }

   async getSubscriptionByStripeSubscriptionId(
      stripeSubscriptionId: string
   ): Promise<DSubscription | null> {
      const subscription = await this.subscriptionRepo.pGetSubscription({
         stripeSubscriptionId,
      });
      return subscription ? toDSubscription(subscription) : null;
   }

   async createSubscription(data: DSubscriptionCreate) {
      const createData: SubscriptionCreate = {
         userId: data.userId,
         planId: data.planId,
         billingInterval: data.billingInterval,
         stripeCheckoutSessionId: data.stripeCheckoutSessionId,
         stripeCustomerId: data.stripeCustomerId,
      };

      await this.subscriptionRepo.pCreateSubscription(createData);
   }

   async updateSubscription(userId: string, data: DSubscriptionUpdate) {
      const updateData: SubscriptionUpdate = {
         status: data.status,
         stripeSubscriptionId: data.stripeSubscriptionId,
         stripeCustomerId: data.stripeCustomerId,
         currentPeriodStart: data.currentPeriodStart,
         currentPeriodEnd: data.currentPeriodEnd,
         cancelAtPeriodEnd: data.cancelAtPeriodEnd,
         canceledAt: data.canceledAt,
      };
      await this.subscriptionRepo.pUpdateSubscription(userId, updateData);
   }

   async deleteSubscription(userId: string) {
      await this.subscriptionRepo.pDeleteSubscription(userId);
   }

   async createSubscriptionHistory(data: DSubscriptionHistoryCreate) {
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
      const subscription = await this.subscriptionRepo.pGetSubscription({
         userId,
      });

      if (subscription && subscription.status === "ACTIVE") {
         return subscription.plan.tier as DSubscriptionTier;
      }
      return "FREE";
   }

   async hasActiveAccess(userId: string): Promise<boolean> {
      const subscription = await this.subscriptionRepo.pGetSubscription({
         userId,
      });

      if (!subscription) {
         return false;
      }

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
}
