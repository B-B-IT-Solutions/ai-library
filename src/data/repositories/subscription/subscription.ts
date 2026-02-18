import { DbClient } from "@/data/types/db/common";
import { SubscriptionWithPlan } from "@/data/types/db/subscription";
import {
   DSubscription,
   DSubscriptionCreate,
   DSubscriptionHistoryCreate,
   DSubscriptionPlan,
   DSubscriptionUpdate,
} from "@/data/types/domain/subscription";
import {
   SubscriptionHistory,
   SubscriptionTier,
} from "@/generated/prisma/client";
import {
   SubscriptionCreateInput,
   SubscriptionHistoryCreateInput,
   SubscriptionUpdateInput,
} from "@/generated/prisma/models";

import {
   toDSubscription,
   toDSubscriptionPlan,
   toDSubscriptionPlans,
} from "./subscription.mapper";

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

   async pCreateSubscription(data: DSubscriptionCreate) {
      const input: SubscriptionCreateInput = {
         billingInterval: data.billingInterval,
         stripeCheckoutSessionId: data.stripeCheckoutSessionId,
         stripeCustomerId: data.stripeCustomerId,
         status: "INCOMPLETE",
         user: {
            connect: {
               id: data.userId,
            },
         },
         plan: {
            connect: {
               id: data.planId,
            },
         },
      };

      await this.prisma.subscription.create({
         data: input,
      });
   }

   async pUpdateSubscription(userId: string, data: DSubscriptionUpdate) {
      const input: SubscriptionUpdateInput = {
         status: data.status,
         stripeSubscriptionId: data.stripeSubscriptionId,
         stripeCustomerId: data.stripeCustomerId,
         stripeCheckoutSessionId: data.stripeCheckoutSessionId,
         currentPeriodStart: data.currentPeriodStart,
         currentPeriodEnd: data.currentPeriodEnd,
         cancelAtPeriodEnd: data.cancelAtPeriodEnd,
         canceledAt: data.canceledAt,
      };

      await this.prisma.subscription.update({
         where: { userId },
         data: input,
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

   async pCreateSubscriptionHistory(data: DSubscriptionHistoryCreate) {
      const input: SubscriptionHistoryCreateInput = {
         eventType: data.eventType,
         fromTier: data.fromTier,
         toTier: data.toTier,
         fromStatus: data.fromStatus,
         toStatus: data.toStatus,
         stripeEventId: data.stripeEventId,
         metadata: data.metadata,
         user: {
            connect: {
               id: data.userId,
            },
         },
      };

      await this.prisma.subscriptionHistory.create({
         data: input,
      });
   }
}
