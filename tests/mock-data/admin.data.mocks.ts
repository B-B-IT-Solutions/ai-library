import { range } from "es-toolkit/compat";

import { DAdminStats } from "@/data/types/domain/admin/stats";
import { DSubscriptionPlanUpdate } from "@/data/types/domain/admin/subscription";
import {
   DAdminUser,
   DAdminUsersFilter,
   DAdminUsersPage,
   DAdminUsersPageQuery,
} from "@/data/types/domain/admin/user";

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

export const dAdminUsersPageQuery = (index = 1): DAdminUsersPageQuery => {
   return {
      pagination: {
         pageSize: 10,
         pageNumber: 1,
      },
      filter: dAdminUsersFilter(index),
      sort: {
         field: "name",
         order: "asc",
      },
   };
};

export const dAdminUsersFilter = (index = 1): DAdminUsersFilter => {
   return {
      search: `search ${index}`,
   };
};

export const dAdminUsersPage = (count = 3): DAdminUsersPage => {
   const users = dAdminUsers(count);
   return {
      content: users,
      numberOfElements: users.length,
      pageNumber: 1,
      pageSize: 3,
      totalElements: 15,
      totalPages: 5,
   };
};

export const dAdminUsers = (count = 3): DAdminUser[] => {
   return range(0, count).map((i) => dAdminUser(i));
};

export const dAdminUser = (index = 1): DAdminUser => {
   return {
      id: `user-id-${index}`,
      name: `User ${index}`,
      email: `user${index}@example.com`,
      role: "user",
      emailVerified: new Date("2025-01-01").toISOString(),
      subscriptionTier: "pro",
      subscriptionStatus: "ACTIVE",
      stripeCustomerId: null,
      trialEndsAt: new Date("2025-01-15").toISOString(),
      updatedAt: new Date("2025-01-01").toISOString(),
      createdAt: new Date("2025-01-01").toISOString(),
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
