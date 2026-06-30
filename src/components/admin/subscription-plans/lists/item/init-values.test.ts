import { dtestData } from "@tests";

import { DSubscriptionPlanUpdate } from "@/data/types/domain/admin/subscription";
import { DSubscriptionPlan } from "@/data/types/domain/subscription";

import { initSubscriptionPlanUpdate } from "./init-values";

const expectedInitSubscriptionPlanUpdate = (
   plan: DSubscriptionPlan
): DSubscriptionPlanUpdate => {
   return {
      name: plan.name,
      description: plan.description,
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      isActive: plan.isActive,
   };
};

describe("initSubscriptionPlanUpdate tests", () => {
   it("init values - test", () => {
      const plan = dtestData.dSubscriptionPlan();
      const initValues = initSubscriptionPlanUpdate(plan);
      const expectedValues = expectedInitSubscriptionPlanUpdate(plan);
      expect(initValues).toEqual(expectedValues);
   });
});
