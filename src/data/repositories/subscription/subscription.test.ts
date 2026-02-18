import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { toDSubscriptionPlans } from "@/data/services/subscription";
import { SubscriptionTier } from "@/generated/prisma/enums";
import {
   SubscriptionCreateArgs,
   SubscriptionDeleteArgs,
   SubscriptionFindUniqueArgs,
   SubscriptionHistoryCreateArgs,
   SubscriptionHistoryFindManyArgs,
   SubscriptionPlanFindManyArgs,
   SubscriptionPlanFindUniqueArgs,
   SubscriptionUpdateArgs,
} from "@/generated/prisma/models";

import { SubscriptionRepository } from "./subscription";

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

   it("pGetPlanById - plan retrieved - test", async () => {
      const plan = ptestData.pSubscriptionPlan();
      prismaMock.subscriptionPlan.findUnique.mockResolvedValue(plan);

      const result = await subscriptionRepo.pGetPlanById(plan.id);

      const expectedFindUniqueArgs: SubscriptionPlanFindUniqueArgs = {
         where: { id: plan.id },
      };

      expect(result).toEqual(plan);
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

   it("pGetPlanByTier - plan retrieved - test", async () => {
      const plan = ptestData.pSubscriptionPlan();
      prismaMock.subscriptionPlan.findUnique.mockResolvedValue(plan);

      const tier: SubscriptionTier = "PRO";
      const result = await subscriptionRepo.pGetPlanByTier(tier);

      const expectedFindUniqueArgs: SubscriptionPlanFindUniqueArgs = {
         where: { tier },
      };

      expect(result).toEqual(plan);
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

   it("pGetSubscription - subscripton retrieved by userId - test", async () => {
      const userId = "user-id-1";
      const subscription = ptestData.pSubscriptionWithPlan();
      prismaMock.subscription.findUnique.mockResolvedValue(subscription);

      const result = await subscriptionRepo.pGetSubscription({ userId });

      const expectedFindUniqueArgs: SubscriptionFindUniqueArgs = {
         where: { userId },
         include: {
            plan: true,
         },
      };

      expect(result).toEqual(subscription);
      expect(prismaMock.subscription.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscription.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });

   it("pGetSubscription - subscripton retrieved by stripeSubscriptionId - test", async () => {
      const stripeSubscriptionId = "stripe-subscription-id-1";
      const subscription = ptestData.pSubscriptionWithPlan();
      prismaMock.subscription.findUnique.mockResolvedValue(subscription);

      const result = await subscriptionRepo.pGetSubscription({
         stripeSubscriptionId,
      });

      const expectedFindUniqueArgs: SubscriptionFindUniqueArgs = {
         where: { stripeSubscriptionId },
         include: {
            plan: true,
         },
      };

      expect(result).toEqual(subscription);
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
      const createData = ptestData.pSubscriptionCreate();

      await subscriptionRepo.pCreateSubscription(createData);

      const exptectedCreateArgs: SubscriptionCreateArgs = {
         data: {
            ...createData,
            status: "INCOMPLETE",
         },
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
      const updateData = ptestData.pSubscriptionUpdate();

      await subscriptionRepo.pUpdateSubscription(userId, updateData);

      const expectedUpdateArgs: SubscriptionUpdateArgs = {
         where: { userId },
         data: updateData,
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
      const data = ptestData.pSubscriptionHistoryCreate();

      await subscriptionRepo.pCreateSubscriptionHistory(data);

      const exptectedCreateArgs: SubscriptionHistoryCreateArgs = {
         data: data,
      };

      expect(prismaMock.subscriptionHistory.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionHistory.create).toHaveBeenCalledWith(
         exptectedCreateArgs
      );
   });
});
