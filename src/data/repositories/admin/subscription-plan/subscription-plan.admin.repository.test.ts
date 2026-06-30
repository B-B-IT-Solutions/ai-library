import { PrismaClient } from "@prisma/client";
import { adtestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { toDSubscriptionPlans } from "@/data/repositories/subscription/subscription.mapper";
import {
   SubscriptionPlanFindManyArgs,
   SubscriptionPlanUpdateArgs,
} from "@/generated/prisma/models";

import { AdminSubscriptionPlanRepository } from "./subscription-plan.admin.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const repository = new AdminSubscriptionPlanRepository(prismaMock);

describe("pGetSubscriptionPlans tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("plans retrieved - test", async () => {
      const plans = ptestData.pSubscriptionPlans();
      prismaMock.subscriptionPlan.findMany.mockResolvedValue(plans);

      const result = await repository.pGetSubscriptionPlans();

      const expectedArgs: SubscriptionPlanFindManyArgs = {
         orderBy: { monthlyPrice: "asc" },
      };
      const expectedResult = toDSubscriptionPlans(plans);

      expect(result).toEqual(expectedResult);
      expect(prismaMock.subscriptionPlan.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionPlan.findMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pUpdateSubscriptionPlan tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("plan updated - test", async () => {
      prismaMock.subscriptionPlan.update.mockResolvedValue({} as never);

      const planId = "plan-id-1";
      const data = adtestData.dSubscriptionPlanUpdate();

      await repository.pUpdateSubscriptionPlan(planId, data);

      const expectedArgs: SubscriptionPlanUpdateArgs = {
         where: { id: planId },
         data: {
            name: data.name,
            description: data.description,
            monthlyPrice: data.monthlyPrice,
            yearlyPrice: data.yearlyPrice,
            isActive: data.isActive,
         },
      };

      expect(prismaMock.subscriptionPlan.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionPlan.update).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});
