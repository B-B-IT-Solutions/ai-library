import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import { SubscriptionWithPlan } from "@/data/types/db/subscription";
import {
   DBillingInterval,
   DSubscription,
   DSubscriptionPlan,
   DSubscriptionPlanFeatures,
   DSubscriptionStatus,
   DSubscriptionTier,
} from "@/data/types/domain/subscription";
import { SubscriptionPlan } from "@/generated/prisma/client";

import {
   toDSubscription,
   toDSubscriptionPlan,
   toDSubscriptionPlans,
} from "./subscription.mapper";

export const toDSubscriptionInternal = (
   subscription: SubscriptionWithPlan
): DSubscription => {
   return {
      id: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status as DSubscriptionStatus,
      billingInterval: subscription.billingInterval as DBillingInterval,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeCheckoutSessionId: subscription.stripeCheckoutSessionId,
      currentPeriodStart:
         subscription.currentPeriodStart?.toISOString() ?? null,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      canceledAt: subscription.canceledAt?.toISOString() ?? null,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
      plan: toDSubscriptionPlan(subscription.plan),
   };
};

export const toDSubscriptionPlansInternal = (
   plans: SubscriptionPlan[]
): DSubscriptionPlan[] => {
   return map(plans, (p) => toDSubscriptionPlanInternal(p));
};

export const toDSubscriptionPlanInternal = (
   plan: SubscriptionPlan
): DSubscriptionPlan => {
   return {
      id: plan.id,
      tier: plan.tier as DSubscriptionTier,
      name: plan.name,
      description: plan.description,
      monthlyPrice: Number(plan.monthlyPrice.toFixed(2)),
      yearlyPrice: Number(plan.yearlyPrice.toFixed(2)),
      stripePriceIdMonthly: plan.stripePriceIdMonthly,
      stripePriceIdYearly: plan.stripePriceIdYearly,
      stripeProductId: plan.stripeProductId,
      features: plan.features as DSubscriptionPlanFeatures,
      isActive: plan.isActive,
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
   };
};

describe("toDSubscription tests", () => {
   it("toDSubscription test", () => {
      const subscription = ptestData.pSubscriptionWithPlan(1);
      const result = toDSubscription(subscription);
      const expectedResult = toDSubscriptionInternal(subscription);
      expect(result).toEqual(expectedResult);
   });

   it("toDSubscription - null dates - test", () => {
      const subscription = ptestData.pSubscriptionWithPlan(1);
      subscription.currentPeriodStart = null;
      subscription.currentPeriodEnd = null;
      subscription.canceledAt = null;

      const result = toDSubscription(subscription);
      const expectedResult = toDSubscriptionInternal(subscription);
      expect(result).toEqual(expectedResult);
   });

   it("toDSubscriptionPlans test", () => {
      const plans = ptestData.pSubscriptionPlans();
      const result = toDSubscriptionPlans(plans);
      const expectedResult = toDSubscriptionPlansInternal(plans);
      expect(result).toEqual(expectedResult);
   });

   it("toDSubscriptionPlan test", () => {
      const plan = ptestData.pSubscriptionPlan(1);
      const result = toDSubscriptionPlan(plan);
      const expectedResult = toDSubscriptionPlanInternal(plan);
      expect(result).toEqual(expectedResult);
   });
});
