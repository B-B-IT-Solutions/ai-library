import { DbClient } from "@/data/types/db/common";
import { DAdminStats } from "@/data/types/domain/admin/stats";
import {
   CatalogEntryCountArgs,
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

      const publishedCountArgs = {
         where: { status: "PUBLISHED" },
      } satisfies CatalogEntryCountArgs;

      const draftCountArgs = {
         where: { status: "DRAFT" },
      } satisfies CatalogEntryCountArgs;

      const [totalUsers, newUsersLast30Days, publishedEntries, draftEntries] =
         await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count(newUsersCountArgs),
            this.prisma.catalogEntry.count(publishedCountArgs),
            this.prisma.catalogEntry.count(draftCountArgs),
         ]);

      return {
         totalUsers,
         newUsersLast30Days,
         publishedCatalogEntries: publishedEntries,
         draftCatalogEntries: draftEntries,
      };
   }
}
