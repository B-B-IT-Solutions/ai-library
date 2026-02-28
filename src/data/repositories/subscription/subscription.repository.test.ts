import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DSubscriptionTier } from "@/data/types/domain/subscription";
import {
   SubscriptionCreateArgs,
   SubscriptionCreateInput,
   SubscriptionDeleteArgs,
   SubscriptionFindUniqueArgs,
   SubscriptionHistoryCreateArgs,
   SubscriptionHistoryCreateInput,
   SubscriptionHistoryFindManyArgs,
   SubscriptionPlanFindManyArgs,
   SubscriptionPlanFindUniqueArgs,
   SubscriptionPlanWhereUniqueInput,
   SubscriptionUpdateArgs,
   SubscriptionUpdateInput,
} from "@/generated/prisma/models";

import { SubscriptionRepository } from "./subscription.repository";
import {
   toDSubscription,
   toDSubscriptionPlan,
   toDSubscriptionPlans,
} from "./subscription.mapper";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const subscriptionRepo = new SubscriptionRepository(prismaMock);

describe("pGetAllPlans tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetAllPlans - plans retrieved - test", async () => {
      const plans = ptestData.pSubscriptionPlans();
      prismaMock.subscriptionPlan.findMany.mockResolvedValue(plans);

      const result = await subscriptionRepo.pGetAllPlans();

      const expectdResult = toDSubscriptionPlans(plans);

      const expectedFindAllArgs: SubscriptionPlanFindManyArgs = {
         where: { isActive: true },
         orderBy: { monthlyPrice: "asc" },
      };

      expect(result).toEqual(expectdResult);
      expect(prismaMock.subscriptionPlan.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionPlan.findMany).toHaveBeenCalledWith(
         expectedFindAllArgs
      );
   });
});

describe("pGetPlanById tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetPlanById - plan null - test", async () => {
      const planId = "plan-id-1";
      prismaMock.subscriptionPlan.findUnique.mockResolvedValue(null);

      const result = await subscriptionRepo.pGetPlanById(planId);

      const expectedFindUniqueArgs: SubscriptionPlanFindUniqueArgs = {
         where: { id: planId },
      };

      expect(result).toBeNull();
      expect(prismaMock.subscriptionPlan.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionPlan.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });

   it("pGetPlanById - plan retrieved - test", async () => {
      const plan = ptestData.pSubscriptionPlan();
      prismaMock.subscriptionPlan.findUnique.mockResolvedValue(plan);

      const result = await subscriptionRepo.pGetPlanById(plan.id);

      const expectdResult = toDSubscriptionPlan(plan);

      const expectedFindUniqueArgs: SubscriptionPlanFindUniqueArgs = {
         where: { id: plan.id },
      };

      expect(result).toEqual(expectdResult);
      expect(prismaMock.subscriptionPlan.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionPlan.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });
});

describe("pGetPlanByTier tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetPlanByTier - plan null - test", async () => {
      prismaMock.subscriptionPlan.findUnique.mockResolvedValue(null);

      const tier: DSubscriptionTier = "PRO";
      const result = await subscriptionRepo.pGetPlanByTier(tier);

      const expectedInput: SubscriptionPlanWhereUniqueInput = {
         tier,
      };

      const expectedFindUniqueArgs: SubscriptionPlanFindUniqueArgs = {
         where: expectedInput,
      };

      expect(result).toBeNull();
      expect(prismaMock.subscriptionPlan.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionPlan.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });

   it("pGetPlanByTier - plan retrieved - test", async () => {
      const plan = ptestData.pSubscriptionPlan();
      prismaMock.subscriptionPlan.findUnique.mockResolvedValue(plan);

      const tier: DSubscriptionTier = "PRO";
      const result = await subscriptionRepo.pGetPlanByTier(tier);

      const expectdResult = toDSubscriptionPlan(plan);

      const expectedInput: SubscriptionPlanWhereUniqueInput = {
         tier,
      };

      const expectedFindUniqueArgs: SubscriptionPlanFindUniqueArgs = {
         where: expectedInput,
      };

      expect(result).toEqual(expectdResult);
      expect(prismaMock.subscriptionPlan.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionPlan.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });
});

describe("pGetSubscription tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetSubscription - subscripton null - test", async () => {
      const userId = "user-id-1";
      prismaMock.subscription.findUnique.mockResolvedValue(null);

      const result = await subscriptionRepo.pGetSubscription({ userId });

      const expectedFindUniqueArgs: SubscriptionFindUniqueArgs = {
         where: { userId },
         include: {
            plan: true,
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.subscription.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscription.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });

   it("pGetSubscription - subscripton retrieved by userId - test", async () => {
      const userId = "user-id-123";
      const subscription = ptestData.pSubscriptionWithPlan();
      prismaMock.subscription.findUnique.mockResolvedValue(subscription);

      const result = await subscriptionRepo.pGetSubscription({ userId });

      const expectdResult = toDSubscription(subscription);

      const expectedFindUniqueArgs: SubscriptionFindUniqueArgs = {
         where: { userId },
         include: {
            plan: true,
         },
      };

      expect(result).toEqual(expectdResult);
      expect(prismaMock.subscription.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscription.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });

   it("pGetSubscription - subscripton retrieved by stripeSubscriptionId - test", async () => {
      const stripeSubscriptionId = "stripe-subscription-id-123";
      const subscription = ptestData.pSubscriptionWithPlan();
      prismaMock.subscription.findUnique.mockResolvedValue(subscription);

      const result = await subscriptionRepo.pGetSubscription({
         stripeSubscriptionId,
      });

      const expectdResult = toDSubscription(subscription);

      const expectedFindUniqueArgs: SubscriptionFindUniqueArgs = {
         where: { stripeSubscriptionId },
         include: {
            plan: true,
         },
      };

      expect(result).toEqual(expectdResult);
      expect(prismaMock.subscription.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscription.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });
});

describe("pCreateSubscription tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pCreateSubscription - subscription created - test", async () => {
      const createData = dtestData.dSubscriptionCreate();

      await subscriptionRepo.pCreateSubscription(createData);

      const expectedInput: SubscriptionCreateInput = {
         billingInterval: createData.billingInterval,
         stripeCheckoutSessionId: createData.stripeCheckoutSessionId,
         stripeCustomerId: createData.stripeCustomerId,
         status: "INCOMPLETE",
         user: {
            connect: {
               id: createData.userId,
            },
         },
         plan: {
            connect: {
               id: createData.planId,
            },
         },
      };

      const exptectedCreateArgs: SubscriptionCreateArgs = {
         data: expectedInput,
      };

      expect(prismaMock.subscription.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscription.create).toHaveBeenCalledWith(
         exptectedCreateArgs
      );
   });
});

describe("pUpdateSubscription tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pUpdateSubscription - subscription updated - test", async () => {
      const userId = "user-id-1";
      const updateData = dtestData.dSubscriptionUpdate();

      await subscriptionRepo.pUpdateSubscription(userId, updateData);

      const expectedInput: SubscriptionUpdateInput = {
         status: updateData.status,
         stripeSubscriptionId: updateData.stripeSubscriptionId,
         stripeCustomerId: updateData.stripeCustomerId,
         stripeCheckoutSessionId: updateData.stripeCheckoutSessionId,
         currentPeriodStart: updateData.currentPeriodStart,
         currentPeriodEnd: updateData.currentPeriodEnd,
         cancelAtPeriodEnd: updateData.cancelAtPeriodEnd,
         canceledAt: updateData.canceledAt,
      };

      const expectedUpdateArgs: SubscriptionUpdateArgs = {
         where: { userId },
         data: expectedInput,
      };

      expect(prismaMock.subscription.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscription.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });
});

describe("pDeleteSubscription tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pDeleteSubscription - subscription deleted - test", async () => {
      const userId = "user-id-1";

      await subscriptionRepo.pDeleteSubscription(userId);

      const exptectedDeleteArgs: SubscriptionDeleteArgs = {
         where: { userId },
      };

      expect(prismaMock.subscription.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscription.delete).toHaveBeenCalledWith(
         exptectedDeleteArgs
      );
   });
});

describe("pGetSubscriptionHistory tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetSubscriptionHistory - history retrieved - test", async () => {
      const userId = "user-id-1";
      const history = ptestData.pSubscriptionHistories();
      prismaMock.subscriptionHistory.findMany.mockResolvedValue(history);

      const result = await subscriptionRepo.pGetSubscriptionHistory(userId);

      const expectedFindManyArgs: SubscriptionHistoryFindManyArgs = {
         where: { userId },
         orderBy: { createdAt: "desc" },
      };

      expect(result).toEqual(history);
      expect(prismaMock.subscriptionHistory.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionHistory.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});

describe("pCreateSubscriptionHistory tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pCreateSubscriptionHistory - history created - test", async () => {
      const data = dtestData.dSubscriptionHistoryCreate();

      await subscriptionRepo.pCreateSubscriptionHistory(data);

      const expectedIinput: SubscriptionHistoryCreateInput = {
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

      const exptectedCreateArgs: SubscriptionHistoryCreateArgs = {
         data: expectedIinput,
      };

      expect(prismaMock.subscriptionHistory.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionHistory.create).toHaveBeenCalledWith(
         exptectedCreateArgs
      );
   });
});
