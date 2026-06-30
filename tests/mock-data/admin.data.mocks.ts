import { DAdminStats } from "@/data/types/domain/admin/stats";

export const dAdminStats = (): DAdminStats => {
   return {
      totalUsers: 5000,
      newUsersLast30Days: 150,
      activeSubscriptions: {
         FREE: 15,
         BASIC: 250,
         PRO: 200,
      },
      revenueLastMonth: 10000,
      pendingOrders: 5,
      publishedCatalogEntries: 150,
      draftCatalogEntries: 51,
   };
};
