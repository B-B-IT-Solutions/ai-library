import { DbClient } from "@/data/types/db/common";
import { DAdminStats } from "@/data/types/domain/admin/stats";

export class AdminDashboardRepository {
   constructor(private readonly prisma: DbClient) {}

   async pGetStats(): Promise<DAdminStats> {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

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
         this.prisma.user.count({
            where: { createdAt: { gte: thirtyDaysAgo } },
         }),
         this.prisma.subscription.groupBy({
            by: ["planId"],
            where: { status: "ACTIVE" },
            _count: true,
         }),
         this.prisma.order.aggregate({
            where: { status: "COMPLETED", createdAt: { gte: thirtyDaysAgo } },
            _sum: { totalAmount: true },
         }),
         this.prisma.order.count({ where: { status: "PENDING" } }),
         this.prisma.catalogEntry.count({ where: { status: "PUBLISHED" } }),
         this.prisma.catalogEntry.count({ where: { status: "DRAFT" } }),
      ]);

      // Get plan tiers for subscription counts
      const planIds = subscriptionsByTier.map((s) => s.planId);
      const plans = await this.prisma.subscriptionPlan.findMany({
         where: { id: { in: planIds } },
         select: { id: true, tier: true },
      });

      const tierMap = new Map(plans.map((p) => [p.id, p.tier]));
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
