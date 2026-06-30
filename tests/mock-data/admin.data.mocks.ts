import {
   DAdminUserDetail,
   DAdminUserListItem,
   DAdminUsersPage,
   DSubscriptionPlanUpdate,
} from "@/data/types/domain/admin/admin";
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

export const dAdminUserListItem = (index = 1): DAdminUserListItem => ({
   id: `user-id-${index}`,
   name: `User ${index}`,
   email: `user${index}@example.com`,
   role: "user",
   emailVerified: null,
   subscriptionTier: null,
   subscriptionStatus: null,
   createdAt: new Date("2025-01-01").toISOString(),
});

export const dAdminUsersPage = (count = 2): DAdminUsersPage => ({
   content: Array.from({ length: count }, (_, i) => dAdminUserListItem(i + 1)),
   pageNumber: 0,
   pageSize: 20,
   totalElements: count,
   totalPages: 1,
   numberOfElements: count,
});

export const dAdminUserDetail = (index = 1): DAdminUserDetail => ({
   ...dAdminUserListItem(index),
   updatedAt: new Date("2025-01-01").toISOString(),
   stripeCustomerId: null,
   trialEndsAt: null,
   subscription: null,
   subscriptionHistory: [],
});

export const dSubscriptionPlanUpdate = (index = 1): DSubscriptionPlanUpdate => {
   return {
      name: `Updated Plan ${index}`,
      description: `Updated description ${index}`,
      monthlyPrice: 19.9,
      yearlyPrice: 199.0,
      isActive: true,
   };
};
