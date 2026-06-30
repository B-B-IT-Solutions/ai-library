import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { toDSubscriptionPlans } from "@/data/repositories/subscription/subscription.mapper";
import { DSubscriptionPlanUpdateInput } from "@/data/types/domain/admin/admin";
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

   test("returns empty list when no plans - test", async () => {
      prismaMock.subscriptionPlan.findMany.mockResolvedValue([]);

      const result = await repository.pGetSubscriptionPlans();

      const expectedArgs: SubscriptionPlanFindManyArgs = {
         orderBy: { monthlyPrice: "asc" },
      };

      expect(result).toEqual([]);
      expect(prismaMock.subscriptionPlan.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionPlan.findMany).toHaveBeenCalledWith(expectedArgs);
   });

   test("returns mapped plans - test", async () => {
      const plans = ptestData.pSubscriptionPlans(2);
      prismaMock.subscriptionPlan.findMany.mockResolvedValue(plans);

      const result = await repository.pGetSubscriptionPlans();

      const expectedArgs: SubscriptionPlanFindManyArgs = {
         orderBy: { monthlyPrice: "asc" },
      };
      const expectedResult = toDSubscriptionPlans(plans);

      expect(result).toEqual(expectedResult);
      expect(prismaMock.subscriptionPlan.findMany).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pUpdateSubscriptionPlan tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("calls prisma with correct args - test", async () => {
      prismaMock.subscriptionPlan.update.mockResolvedValue({} as never);

      const planId = "plan-id-1";
      const input: DSubscriptionPlanUpdateInput = {
         name: "Updated Plan",
         description: "Updated description",
         monthlyPrice: 19.9,
         yearlyPrice: 199.0,
         isActive: true,
      };

      await repository.pUpdateSubscriptionPlan(planId, input);

      const expectedArgs: SubscriptionPlanUpdateArgs = {
         where: { id: planId },
         data: {
            name: input.name,
            description: input.description,
            monthlyPrice: input.monthlyPrice,
            yearlyPrice: input.yearlyPrice,
            isActive: input.isActive,
         },
      };

      expect(prismaMock.subscriptionPlan.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionPlan.update).toHaveBeenCalledWith(expectedArgs);
   });
});
