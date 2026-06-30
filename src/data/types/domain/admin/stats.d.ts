export type DAdminStats = {
   totalUsers: number;
   newUsersLast30Days: number;
   activeSubscriptions: { FREE: number; BASIC: number; PRO: number };
   revenueLastMonth: number;
   pendingOrders: number;
   publishedCatalogEntries: number;
   draftCatalogEntries: number;
};
