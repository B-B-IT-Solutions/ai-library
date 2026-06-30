import { toDSubscriptionPlans } from "@/data/repositories/subscription/subscription.mapper";
import { DbClient } from "@/data/types/db/common";
import { DSubscriptionPlanUpdateInput } from "@/data/types/domain/admin/admin";
import { DSubscriptionPlan } from "@/data/types/domain/subscription";
import { SubscriptionPlanFindManyArgs } from "@/generated/prisma/models";

export class AdminSubscriptionPlanRepository {
   constructor(private readonly prisma: DbClient) {}

   async pGetSubscriptionPlans(): Promise<DSubscriptionPlan[]> {
      const args = {
         orderBy: { monthlyPrice: "asc" as const },
      } satisfies SubscriptionPlanFindManyArgs;

      const plans = await this.prisma.subscriptionPlan.findMany(args);
      return toDSubscriptionPlans(plans);
   }

   async pUpdateSubscriptionPlan(
      planId: string,
      input: DSubscriptionPlanUpdateInput
   ): Promise<void> {
      await this.prisma.subscriptionPlan.update({
         where: { id: planId },
         data: {
            name: input.name,
            description: input.description,
            monthlyPrice: input.monthlyPrice,
            yearlyPrice: input.yearlyPrice,
            isActive: input.isActive,
         },
      });
   }
}
