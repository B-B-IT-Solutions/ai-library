import { DbClient } from "@/data/types/db/common";
import {
  Subscription,
  SubscriptionPlan,
  SubscriptionHistory,
  SubscriptionTier,
  SubscriptionStatus,
} from "@/generated/prisma/client";

export type SubscriptionWithPlan = Subscription & {
  plan: SubscriptionPlan;
};

export type SubscriptionUpdate = {
  status?: SubscriptionStatus;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripeCheckoutSessionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: Date | null;
};

export type SubscriptionHistoryCreate = {
  userId: string;
  eventType: string;
  fromTier?: SubscriptionTier;
  toTier?: SubscriptionTier;
  fromStatus?: SubscriptionStatus;
  toStatus?: SubscriptionStatus;
  stripeEventId?: string;
  metadata?: any;
};

export class SubscriptionRepository {
  private prisma: DbClient;

  constructor(prisma: DbClient) {
    this.prisma = prisma;
  }

  async pGetUserSubscription(
    userId: string
  ): Promise<SubscriptionWithPlan | null> {
    return await this.prisma.subscription.findUnique({
      where: { userId },
      include: {
        plan: true,
      },
    });
  }

  async pGetByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<SubscriptionWithPlan | null> {
    return await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId },
      include: {
        plan: true,
      },
    });
  }

  async pGetByCheckoutSessionId(
    checkoutSessionId: string
  ): Promise<SubscriptionWithPlan | null> {
    return await this.prisma.subscription.findUnique({
      where: { stripeCheckoutSessionId: checkoutSessionId },
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

  async pGetAllPlans(): Promise<SubscriptionPlan[]> {
    return await this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { monthlyPrice: "asc" },
    });
  }

  async pGetPlanByTier(
    tier: SubscriptionTier
  ): Promise<SubscriptionPlan | null> {
    return await this.prisma.subscriptionPlan.findUnique({
      where: { tier },
    });
  }

  async pGetPlanById(planId: string): Promise<SubscriptionPlan | null> {
    return await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
  }

  async pCreateHistory(
    data: SubscriptionHistoryCreate
  ): Promise<SubscriptionHistory> {
    return await this.prisma.subscriptionHistory.create({
      data,
    });
  }

  async pGetUserHistory(userId: string): Promise<SubscriptionHistory[]> {
    return await this.prisma.subscriptionHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async pUpdateUserStripeCustomerId(
    userId: string,
    stripeCustomerId: string
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId },
    });
  }

  async pGetUserByStripeCustomerId(
    stripeCustomerId: string
  ): Promise<{ id: string; email: string } | null> {
    return await this.prisma.user.findUnique({
      where: { stripeCustomerId },
      select: { id: true, email: true },
    });
  }
}
