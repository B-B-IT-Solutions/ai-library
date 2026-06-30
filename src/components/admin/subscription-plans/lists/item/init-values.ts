import { DSubscriptionPlanUpdate } from "@/data/types/domain/admin/subscription";
import { DSubscriptionPlan } from "@/data/types/domain/subscription";

export const initSubscriptionPlanUpdate = (
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
