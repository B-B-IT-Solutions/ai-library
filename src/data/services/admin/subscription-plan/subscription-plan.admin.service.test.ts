jest.mock("@/data/repositories/admin/subscription-plan");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { AdminSubscriptionPlanRepository } from "@/data/repositories/admin/subscription-plan";
import prisma from "@/data/repositories/prisma";
import { DSubscriptionPlanUpdateInput } from "@/data/types/domain/admin/admin";

import { AdminSubscriptionPlanService } from "./subscription-plan.admin.service";

const repo = new AdminSubscriptionPlanRepository(prisma);
const repoMock = repo as DeepMockProxy<AdminSubscriptionPlanRepository>;

const service = new AdminSubscriptionPlanService(repoMock);

describe("getSubscriptionPlans tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("returns plans from repository - test", async () => {
      const plans = dtestData.dSubscriptionPlans(2);
      repoMock.pGetSubscriptionPlans.mockResolvedValue(plans);

      const result = await service.getSubscriptionPlans();

      expect(result).toEqual(plans);
      expect(repoMock.pGetSubscriptionPlans).toHaveBeenCalledTimes(1);
   });
});

describe("updateSubscriptionPlan tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("delegates to repository - test", async () => {
      repoMock.pUpdateSubscriptionPlan.mockResolvedValue(undefined);

      const planId = "plan-id-1";
      const input: DSubscriptionPlanUpdateInput = {
         name: "Updated Plan",
         description: "Updated description",
         monthlyPrice: 19.9,
         yearlyPrice: 199.0,
         isActive: true,
      };

      await service.updateSubscriptionPlan(planId, input);

      expect(repoMock.pUpdateSubscriptionPlan).toHaveBeenCalledTimes(1);
      expect(repoMock.pUpdateSubscriptionPlan).toHaveBeenCalledWith(planId, input);
   });
});
