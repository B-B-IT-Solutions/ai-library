import { AdminSubscriptionPlanRepository } from "@/data/repositories/admin/subscription-plan";
import { DSubscriptionPlanUpdate } from "@/data/types/domain/admin/subscription";
import { DSubscriptionPlan } from "@/data/types/domain/subscription";

export class AdminSubscriptionPlanService {
   constructor(private readonly repo: AdminSubscriptionPlanRepository) {}

   async getSubscriptionPlans(): Promise<DSubscriptionPlan[]> {
      return await this.repo.pGetSubscriptionPlans();
   }

   async updateSubscriptionPlan(planId: string, data: DSubscriptionPlanUpdate) {
      await this.repo.pUpdateSubscriptionPlan(planId, data);
   }
}
