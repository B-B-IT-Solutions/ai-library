import { PrismaClient } from "@prisma/client";
import { DeepMockProxy } from "jest-mock-extended";
import MockDate from "mockdate";

import prisma from "@/data/repositories/prisma";
import { DAdminStats } from "@/data/types/domain/admin/stats";
import {
   CatalogEntryCountArgs,
   OrderAggregateArgs,
   OrderCountArgs,
   SubscriptionGroupByArgs,
   SubscriptionPlanFindManyArgs,
   UserCountArgs,
} from "@/generated/prisma/models";

import { AdminDashboardRepository } from "./dashboard.admin.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const repository = new AdminDashboardRepository(prismaMock);

describe("pGetStats tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      MockDate.set("2025-09-27");
   });

   afterEach(() => {
      MockDate.reset();
   });

   test("returns zeros when no data - test", async () => {
      prismaMock.user.count.mockResolvedValue(0);
      prismaMock.subscription.groupBy.mockResolvedValue([]);
      prismaMock.order.aggregate.mockResolvedValue({
         _sum: { totalAmount: null },
         _count: 0,
         _avg: { totalAmount: null },
         _min: { totalAmount: null },
         _max: { totalAmount: null },
      });
      prismaMock.order.count.mockResolvedValue(0);
      prismaMock.catalogEntry.count.mockResolvedValue(0);
      prismaMock.subscriptionPlan.findMany.mockResolvedValue([]);

      const result = await repository.pGetStats();

      const expectedResult: DAdminStats = {
         totalUsers: 0,
         newUsersLast30Days: 0,
         activeSubscriptions: { FREE: 0, BASIC: 0, PRO: 0 },
         revenueLastMonth: 0,
         pendingOrders: 0,
         publishedCatalogEntries: 0,
         draftCatalogEntries: 0,
      };

      expect(result).toEqual(expectedResult);
   });

   test("returns correct stats with data - test", async () => {
      prismaMock.user.count
         .mockResolvedValueOnce(100)
         .mockResolvedValueOnce(10);
      prismaMock.subscription.groupBy.mockResolvedValue([
         { planId: "plan-basic-id", _count: 5 },
         { planId: "plan-pro-id", _count: 3 },
      ] as never);
      prismaMock.order.aggregate.mockResolvedValue({
         _sum: { totalAmount: 1500 },
         _count: 10,
         _avg: { totalAmount: 150 },
         _min: { totalAmount: 50 },
         _max: { totalAmount: 500 },
      } as never);
      prismaMock.order.count.mockResolvedValue(2);
      prismaMock.catalogEntry.count
         .mockResolvedValueOnce(50)
         .mockResolvedValueOnce(5);
      prismaMock.subscriptionPlan.findMany.mockResolvedValue([
         { id: "plan-basic-id", tier: "BASIC" },
         { id: "plan-pro-id", tier: "PRO" },
      ] as never);

      const result = await repository.pGetStats();

      const thirtyDaysAgo = new Date("2025-09-27");
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const expectedNewUsersCountArgs: UserCountArgs = {
         where: { createdAt: { gte: thirtyDaysAgo } },
      };
      const expectedSubscriptionGroupByArgs: SubscriptionGroupByArgs = {
         by: ["planId"],
         where: { status: "ACTIVE" },
         _count: true,
      };
      const expectedOrderAggregateArgs: OrderAggregateArgs = {
         where: { status: "COMPLETED", createdAt: { gte: thirtyDaysAgo } },
         _sum: { totalAmount: true },
      };
      const expectedOrderCountArgs: OrderCountArgs = {
         where: { status: "PENDING" },
      };
      const expectedPublishedCountArgs: CatalogEntryCountArgs = {
         where: { status: "PUBLISHED" },
      };
      const expectedDraftCountArgs: CatalogEntryCountArgs = {
         where: { status: "DRAFT" },
      };
      const expectedPlanFindManyArgs: SubscriptionPlanFindManyArgs = {
         where: { id: { in: ["plan-basic-id", "plan-pro-id"] } },
         select: { id: true, tier: true },
      };

      const expectedResult: DAdminStats = {
         totalUsers: 100,
         newUsersLast30Days: 10,
         activeSubscriptions: { FREE: 0, BASIC: 5, PRO: 3 },
         revenueLastMonth: 1500,
         pendingOrders: 2,
         publishedCatalogEntries: 50,
         draftCatalogEntries: 5,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.user.count).toHaveBeenCalledTimes(2);
      expect(prismaMock.user.count).toHaveBeenNthCalledWith(1);
      expect(prismaMock.user.count).toHaveBeenNthCalledWith(
         2,
         expectedNewUsersCountArgs
      );
      expect(prismaMock.subscription.groupBy).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscription.groupBy).toHaveBeenCalledWith(
         expectedSubscriptionGroupByArgs
      );
      expect(prismaMock.order.aggregate).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.aggregate).toHaveBeenCalledWith(
         expectedOrderAggregateArgs
      );
      expect(prismaMock.order.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.count).toHaveBeenCalledWith(
         expectedOrderCountArgs
      );
      expect(prismaMock.catalogEntry.count).toHaveBeenCalledTimes(2);
      expect(prismaMock.catalogEntry.count).toHaveBeenCalledWith(
         expectedPublishedCountArgs
      );
      expect(prismaMock.catalogEntry.count).toHaveBeenCalledWith(
         expectedDraftCountArgs
      );
      expect(prismaMock.subscriptionPlan.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.subscriptionPlan.findMany).toHaveBeenCalledWith(
         expectedPlanFindManyArgs
      );
   });
});
