import { AdminSubscriptionPlanRepository } from "@/data/repositories/admin/subscription-plan";
import { DSubscriptionPlanUpdateInput } from "@/data/types/domain/admin/admin";
import { DSubscriptionPlan } from "@/data/types/domain/subscription";

export class AdminSubscriptionPlanService {
   constructor(private readonly repo: AdminSubscriptionPlanRepository) {}

   async getSubscriptionPlans(): Promise<DSubscriptionPlan[]> {
      return await this.repo.pGetSubscriptionPlans();
   }

   async updateSubscriptionPlan(
      planId: string,
      input: DSubscriptionPlanUpdateInput
   ): Promise<void> {
      await this.repo.pUpdateSubscriptionPlan(planId, input);
   }
}
