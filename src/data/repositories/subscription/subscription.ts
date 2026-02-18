import {
   toDSubscription,
   toDSubscriptionPlan,
   toDSubscriptionPlans,
} from "@/data/services/subscription";
import { DbClient } from "@/data/types/db/common";
import {
   SubscriptionCreate,
   SubscriptionHistoryCreate,
   SubscriptionUpdate,
   SubscriptionWithPlan,
} from "@/data/types/db/subscription";
import {
   DSubscription,
   DSubscriptionPlan,
} from "@/data/types/domain/subscription";
import {
   SubscriptionHistory,
   SubscriptionTier,
} from "@/generated/prisma/client";

export type GetSubscriptionParams =
   | { userId: string; stripeSubscriptionId?: undefined }
   | { userId?: undefined; stripeSubscriptionId: string };

export class SubscriptionRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetAllPlans(): Promise<DSubscriptionPlan[]> {
      const plans = await this.prisma.subscriptionPlan.findMany({
         where: { isActive: true },
         orderBy: { monthlyPrice: "asc" },
      });
      return toDSubscriptionPlans(plans);
   }

   async pGetPlanById(planId: string): Promise<DSubscriptionPlan | null> {
      const plan = await this.prisma.subscriptionPlan.findUnique({
         where: { id: planId },
      });

      return plan ? toDSubscriptionPlan(plan) : null;
   }

   async pGetPlanByTier(
      tier: SubscriptionTier
   ): Promise<DSubscriptionPlan | null> {
      const plan = await this.prisma.subscriptionPlan.findUnique({
         where: { tier },
      });

      return plan ? toDSubscriptionPlan(plan) : null;
   }

   async pGetSubscription(
      params: GetSubscriptionParams
   ): Promise<DSubscription | null> {
      const { userId, stripeSubscriptionId } = params;
      const subscription: SubscriptionWithPlan | null =
         await this.prisma.subscription.findUnique({
            where: {
               userId,
               stripeSubscriptionId,
            },
            include: {
               plan: true,
            },
         });

      return subscription ? toDSubscription(subscription) : null;
   }

   async pCreateSubscription(data: SubscriptionCreate) {
      await this.prisma.subscription.create({
         data: {
            userId: data.userId,
            planId: data.planId,
            billingInterval: data.billingInterval,
            stripeCheckoutSessionId: data.stripeCheckoutSessionId,
            stripeCustomerId: data.stripeCustomerId,
            status: "INCOMPLETE",
         },
      });
   }

   async pUpdateSubscription(userId: string, data: SubscriptionUpdate) {
      await this.prisma.subscription.update({
         where: { userId },
         data: {
            status: data.status,
            stripeSubscriptionId: data.stripeSubscriptionId,
            stripeCustomerId: data.stripeCustomerId,
            stripeCheckoutSessionId: data.stripeCheckoutSessionId,
            currentPeriodStart: data.currentPeriodStart,
            currentPeriodEnd: data.currentPeriodEnd,
            cancelAtPeriodEnd: data.cancelAtPeriodEnd,
            canceledAt: data.canceledAt,
         },
      });
   }

   async pDeleteSubscription(userId: string) {
      await this.prisma.subscription.delete({
         where: { userId },
      });
   }

   async pGetSubscriptionHistory(
      userId: string
   ): Promise<SubscriptionHistory[]> {
      return await this.prisma.subscriptionHistory.findMany({
         where: { userId },
         orderBy: { createdAt: "desc" },
      });
   }

   async pCreateSubscriptionHistory(data: SubscriptionHistoryCreate) {
      await this.prisma.subscriptionHistory.create({
         data: {
            userId: data.userId,
            eventType: data.eventType,
            fromTier: data.fromTier,
            toTier: data.toTier,
            fromStatus: data.fromStatus,
            toStatus: data.toStatus,
            stripeEventId: data.stripeEventId,
            metadata: data.metadata,
         },
      });
   }
}
