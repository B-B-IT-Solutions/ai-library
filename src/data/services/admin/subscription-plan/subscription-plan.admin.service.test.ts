jest.mock("@/data/repositories/admin/subscription-plan");

import { adtestData, dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { AdminSubscriptionPlanRepository } from "@/data/repositories/admin/subscription-plan";
import prisma from "@/data/repositories/prisma";
import { DSubscriptionPlanUpdate } from "@/data/types/domain/admin/admin";

import { AdminSubscriptionPlanService } from "./subscription-plan.admin.service";

const subscriptionPlanRepo = new AdminSubscriptionPlanRepository(prisma);
const subscriptionPlanRepoMock =
   subscriptionPlanRepo as DeepMockProxy<AdminSubscriptionPlanRepository>;

const service = new AdminSubscriptionPlanService(subscriptionPlanRepoMock);

describe("getSubscriptionPlans tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("plans retrieved - test", async () => {
      const plans = dtestData.dSubscriptionPlans();
      subscriptionPlanRepoMock.pGetSubscriptionPlans.mockResolvedValue(plans);

      const result = await service.getSubscriptionPlans();

      expect(result).toEqual(plans);
      expect(
         subscriptionPlanRepoMock.pGetSubscriptionPlans
      ).toHaveBeenCalledTimes(1);
   });
});

describe("updateSubscriptionPlan tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("plan updated - test", async () => {
      subscriptionPlanRepoMock.pUpdateSubscriptionPlan.mockResolvedValue();

      const planId = "plan-id-1";
      const data = adtestData.dSubscriptionPlanUpdate();

      await service.updateSubscriptionPlan(planId, data);

      expect(
         subscriptionPlanRepoMock.pUpdateSubscriptionPlan
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionPlanRepoMock.pUpdateSubscriptionPlan
      ).toHaveBeenCalledWith(planId, data);
   });
});
