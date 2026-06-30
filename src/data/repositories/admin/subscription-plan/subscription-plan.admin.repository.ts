import { toDSubscriptionPlans } from "@/data/repositories/subscription/subscription.mapper";
import { DbClient } from "@/data/types/db/common";
import { DSubscriptionPlanUpdate } from "@/data/types/domain/admin/subscription";
import { DSubscriptionPlan } from "@/data/types/domain/subscription";
import {
   SubscriptionPlanFindManyArgs,
   SubscriptionPlanUpdateArgs,
} from "@/generated/prisma/models";

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
      data: DSubscriptionPlanUpdate
   ) {
      const args = {
         where: { id: planId },
         data: {
            name: data.name,
            description: data.description,
            monthlyPrice: data.monthlyPrice,
            yearlyPrice: data.yearlyPrice,
            isActive: data.isActive,
         },
      } satisfies SubscriptionPlanUpdateArgs;

      await this.prisma.subscriptionPlan.update(args);
   }
}
