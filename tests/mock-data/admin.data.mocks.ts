import { DSubscriptionPlanUpdate as DSubscriptionPlanUpdate } from "@/data/types/domain/admin/admin";
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

export const dSubscriptionPlanUpdate = (index = 1): DSubscriptionPlanUpdate => {
   return {
      name: `Updated Plan ${index}`,
      description: `Updated description ${index}`,
      monthlyPrice: 19.9,
      yearlyPrice: 199.0,
      isActive: true,
   };
};
