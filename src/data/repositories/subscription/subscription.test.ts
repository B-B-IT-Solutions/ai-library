import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { SubscriptionTier } from "@/generated/prisma/enums";
import {
   SubscriptionFindUniqueArgs,
   SubscriptionPlanFindManyArgs,
   SubscriptionPlanFindUniqueArgs,
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

      const expectedFindAllArgs: SubscriptionPlanFindManyArgs = {
         where: { isActive: true },
         orderBy: { monthlyPrice: "asc" },
      };

      expect(result).toEqual(plans);
      expect(prismaMock.subscriptionPlan.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionPlan.findMany).toHaveBeenCalledWith(
         expectedFindAllArgs
      );
   });
});

describe("pGetPlanByTier tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetPlanByTier - plan retrieved - test", async () => {
      const plans = ptestData.pSubscriptionPlans();
      prismaMock.subscriptionPlan.findUnique.mockResolvedValue(plans);

      const tier: SubscriptionTier = "PRO";
      const result = await subscriptionRepo.pGetPlanByTier(tier);

      const expectedFindUniqueArgs: SubscriptionPlanFindUniqueArgs = {
         where: { tier },
      };

      expect(result).toEqual(plans);
      expect(prismaMock.subscriptionPlan.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionPlan.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });
});

describe("pGetUserSubscription tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("pGetUserSubscription - subscripton retrieved - test", async () => {
      const userId = "user-id-1";
      const subscription = ptestData.pSubscriptionWithPlan();
      prismaMock.subscription.findUnique.mockResolvedValue(subscription);

      const result = await subscriptionRepo.pGetUserSubscription(userId);

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
});
