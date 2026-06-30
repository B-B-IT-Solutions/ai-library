import { DbClient } from "@/data/types/db/common";
import { DAdminStats } from "@/data/types/domain/admin/stats";
import {
   CatalogEntryCountArgs,
   OrderAggregateArgs,
   OrderCountArgs,
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
         revenueResult,
         pendingOrders,
         publishedEntries,
         draftEntries,
      ] = await Promise.all([
         this.prisma.user.count(),
         this.prisma.user.count(newUsersCountArgs),
         this.prisma.order.aggregate(orderAggregateArgs),
         this.prisma.order.count(orderCountArgs),
         this.prisma.catalogEntry.count(publishedCountArgs),
         this.prisma.catalogEntry.count(draftCountArgs),
      ]);

      return {
         totalUsers,
         newUsersLast30Days,
         revenueLastMonth: Number(revenueResult._sum.totalAmount ?? 0),
         pendingOrders,
         publishedCatalogEntries: publishedEntries,
         draftCatalogEntries: draftEntries,
      };
   }
}
