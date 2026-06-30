import { map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import { DAdminStats } from "@/data/types/domain/admin/stats";
import {
   CatalogEntryCountArgs,
   OrderAggregateArgs,
   OrderCountArgs,
   SubscriptionGroupByArgs,
   SubscriptionPlanFindManyArgs,
   UserCountArgs,
} from "@/generated/prisma/models";

export class AdminDashboardRepository {
   constructor(private readonly prisma: DbClient) {}

   async pGetStats(): Promise<DAdminStats> {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const newUsersCountArgs = {
         where: { createdAt: { gte: thirtyDaysAgo } },
      } satisfies UserCountArgs;

      const subscriptionGroupByArgs = {
         by: ["planId"],
         where: { status: "ACTIVE" },
         _count: true,
      } satisfies SubscriptionGroupByArgs;

      const orderAggregateArgs = {
         where: { status: "COMPLETED", createdAt: { gte: thirtyDaysAgo } },
         _sum: { totalAmount: true },
      } satisfies OrderAggregateArgs;

      const orderCountArgs = {
         where: { status: "PENDING" },
      } satisfies OrderCountArgs;

      const publishedCountArgs = {
         where: { status: "PUBLISHED" },
      } satisfies CatalogEntryCountArgs;

      const draftCountArgs = {
         where: { status: "DRAFT" },
      } satisfies CatalogEntryCountArgs;

      const [
         totalUsers,
         newUsersLast30Days,
         subscriptionsByTier,
         revenueResult,
         pendingOrders,
         publishedEntries,
         draftEntries,
      ] = await Promise.all([
         this.prisma.user.count(),
         this.prisma.user.count(newUsersCountArgs),
         this.prisma.subscription.groupBy(subscriptionGroupByArgs),
         this.prisma.order.aggregate(orderAggregateArgs),
         this.prisma.order.count(orderCountArgs),
         this.prisma.catalogEntry.count(publishedCountArgs),
         this.prisma.catalogEntry.count(draftCountArgs),
      ]);

      // Get plan tiers for subscription counts
      const planIds = map(subscriptionsByTier, (s) => s.planId);
      const planFindManyArgs: SubscriptionPlanFindManyArgs = {
         where: { id: { in: planIds } },
         select: { id: true, tier: true },
      } satisfies SubscriptionPlanFindManyArgs;

      const plans =
         await this.prisma.subscriptionPlan.findMany(planFindManyArgs);

      const tierMap = new Map(map(plans, (p) => [p.id, p.tier]));
      const activeSubscriptions = { FREE: 0, BASIC: 0, PRO: 0 };

      for (const s of subscriptionsByTier) {
         const tier = tierMap.get(s.planId) as keyof typeof activeSubscriptions;
         if (tier) activeSubscriptions[tier] = s._count;
      }

      return {
         totalUsers,
         newUsersLast30Days,
         activeSubscriptions,
         revenueLastMonth: Number(revenueResult._sum.totalAmount ?? 0),
         pendingOrders,
         publishedCatalogEntries: publishedEntries,
         draftCatalogEntries: draftEntries,
      };
   }
}
