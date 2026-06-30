import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";

import { AdminSubscriptionRepository } from "./admin-subscription.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const repo = new AdminSubscriptionRepository(prismaMock);

describe("pGetSubscriptionsPage tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("returns empty page when no subscriptions - test", async () => {
      prismaMock.subscription.findMany.mockResolvedValue([]);
      prismaMock.subscription.count.mockResolvedValue(0);

      const result = await repo.pGetSubscriptionsPage();

      expect(result.content).toEqual([]);
      expect(result.totalElements).toBe(0);
      expect(result.pageNumber).toBe(0);
      expect(result.pageSize).toBe(20);
      expect(result.totalPages).toBe(0);
      expect(result.numberOfElements).toBe(0);
   });

   it("returns subscriptions page with defaults - test", async () => {
      const user = ptestData.pUser();
      const plan = ptestData.pSubscriptionPlan();
      const sub = {
         ...ptestData.pSubscription(),
         user: { email: user.email, name: user.name },
         plan: { tier: plan.tier, name: plan.name },
      };
      prismaMock.subscription.findMany.mockResolvedValue([sub] as never);
      prismaMock.subscription.count.mockResolvedValue(1);

      const result = await repo.pGetSubscriptionsPage();

      expect(result.content).toHaveLength(1);
      expect(result.content[0].userEmail).toBe(user.email);
      expect(result.content[0].userName).toBe(user.name);
      expect(result.content[0].planTier).toBe(plan.tier);
      expect(result.content[0].planName).toBe(plan.name);
      expect(result.totalElements).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.numberOfElements).toBe(1);
      expect(prismaMock.subscription.findMany).toHaveBeenCalledWith(
         expect.objectContaining({
            where: {},
            skip: 0,
            take: 20,
         })
      );
   });

   it("applies status filter - test", async () => {
      prismaMock.subscription.findMany.mockResolvedValue([]);
      prismaMock.subscription.count.mockResolvedValue(0);

      await repo.pGetSubscriptionsPage({ status: "ACTIVE" });

      expect(prismaMock.subscription.findMany).toHaveBeenCalledWith(
         expect.objectContaining({
            where: { status: "ACTIVE" },
         })
      );
   });

   it("applies tier filter - test", async () => {
      prismaMock.subscription.findMany.mockResolvedValue([]);
      prismaMock.subscription.count.mockResolvedValue(0);

      await repo.pGetSubscriptionsPage({ tier: "PRO" });

      expect(prismaMock.subscription.findMany).toHaveBeenCalledWith(
         expect.objectContaining({
            where: { plan: { tier: "PRO" } },
         })
      );
   });

   it("applies pagination - test", async () => {
      prismaMock.subscription.findMany.mockResolvedValue([]);
      prismaMock.subscription.count.mockResolvedValue(0);

      await repo.pGetSubscriptionsPage({ pagination: { pageNumber: 1, pageSize: 10 } });

      expect(prismaMock.subscription.findMany).toHaveBeenCalledWith(
         expect.objectContaining({
            skip: 10,
            take: 10,
         })
      );
   });

   it("calculates total pages correctly - test", async () => {
      prismaMock.subscription.findMany.mockResolvedValue([]);
      prismaMock.subscription.count.mockResolvedValue(45);

      const result = await repo.pGetSubscriptionsPage({ pagination: { pageNumber: 0, pageSize: 20 } });

      expect(result.totalPages).toBe(3);
   });
});
