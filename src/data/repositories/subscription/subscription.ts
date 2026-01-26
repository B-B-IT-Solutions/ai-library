import { DbClient } from "@/data/types/db/common";
import {
   SubscriptionHistoryCreate,
   SubscriptionUpdate,
   SubscriptionWithPlan,
} from "@/data/types/db/subscription";
import {
   Subscription,
   SubscriptionHistory,
   SubscriptionPlan,
   SubscriptionTier,
} from "@/generated/prisma/client";

export class SubscriptionRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetAllPlans(): Promise<SubscriptionPlan[]> {
      return await this.prisma.subscriptionPlan.findMany({
         where: { isActive: true },
         orderBy: { monthlyPrice: "asc" },
      });
   }

   async pGetPlanById(planId: string): Promise<SubscriptionPlan | null> {
      return await this.prisma.subscriptionPlan.findUnique({
         where: { id: planId },
      });
   }

   async pGetPlanByTier(
      tier: SubscriptionTier
   ): Promise<SubscriptionPlan | null> {
      return await this.prisma.subscriptionPlan.findUnique({
         where: { tier },
      });
   }

   async pGetSubscription(
      userId: string
   ): Promise<SubscriptionWithPlan | null> {
      return await this.prisma.subscription.findUnique({
         where: { userId },
         include: {
            plan: true,
         },
      });
   }
   async pGetSubscriptionByStripeSubscriptionId(
      stripeSubscriptionId: string
   ): Promise<SubscriptionWithPlan | null> {
      return await this.prisma.subscription.findUnique({
         where: { stripeSubscriptionId },
         include: {
            plan: true,
         },
      });
   }

   async pCreateSubscription(data: {
      userId: string;
      planId: string;
      billingInterval: "MONTHLY" | "YEARLY";
      stripeCheckoutSessionId?: string;
      stripeCustomerId?: string;
   }): Promise<Subscription> {
      return await this.prisma.subscription.create({
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

   async pUpdateSubscription(
      userId: string,
      data: SubscriptionUpdate
   ): Promise<Subscription> {
      return await this.prisma.subscription.update({
         where: { userId },
         data,
      });
   }

   async pDeleteSubscription(userId: string): Promise<Subscription> {
      return await this.prisma.subscription.delete({
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

   async pCreateSubscriptionHistory(
      data: SubscriptionHistoryCreate
   ): Promise<SubscriptionHistory> {
      return await this.prisma.subscriptionHistory.create({
         data,
      });
   }
}
