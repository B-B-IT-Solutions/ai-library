import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockReset } from "jest-mock-extended";
import MockDate from "mockdate";

import prisma from "@/data/repositories/prisma";

import { AdminDashboardRepository } from "./dashboard.admin.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const repo = new AdminDashboardRepository(prismaMock);

describe("pGetStats tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
      MockDate.set("2025-09-27");
   });

   afterEach(() => {
      MockDate.reset();
   });

   it("returns stats with all zeros - test", async () => {
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

      const result = await repo.pGetStats();

      expect(result.totalUsers).toBe(0);
      expect(result.newUsersLast30Days).toBe(0);
      expect(result.activeSubscriptions).toEqual({ FREE: 0, BASIC: 0, PRO: 0 });
      expect(result.revenueLastMonth).toBe(0);
      expect(result.pendingOrders).toBe(0);
      expect(result.publishedCatalogEntries).toBe(0);
      expect(result.draftCatalogEntries).toBe(0);
   });

   it("returns correct stats with data - test", async () => {
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

      const result = await repo.pGetStats();

      expect(result.totalUsers).toBe(100);
      expect(result.newUsersLast30Days).toBe(10);
      expect(result.activeSubscriptions.BASIC).toBe(5);
      expect(result.activeSubscriptions.PRO).toBe(3);
      expect(result.activeSubscriptions.FREE).toBe(0);
      expect(result.revenueLastMonth).toBe(1500);
      expect(result.pendingOrders).toBe(2);
      expect(result.publishedCatalogEntries).toBe(50);
      expect(result.draftCatalogEntries).toBe(5);
   });

   it("uses correct date filter for last 30 days - test", async () => {
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

      await repo.pGetStats();

      // Verify that user count was called twice (total and new)
      expect(prismaMock.user.count).toHaveBeenCalledTimes(2);

      // Second call should have a date filter
      const secondCall = prismaMock.user.count.mock.calls[1];
      expect(secondCall[0]).toEqual(
         expect.objectContaining({
            where: expect.objectContaining({
               createdAt: expect.objectContaining({
                  gte: expect.any(Date),
               }),
            }),
         })
      );
   });
});
