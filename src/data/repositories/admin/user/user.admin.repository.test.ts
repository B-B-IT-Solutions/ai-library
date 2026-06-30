import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { UserUpdateArgs } from "@/generated/prisma/models";

import { AdminUserRepository } from "./user.admin.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const repo = new AdminUserRepository(prismaMock);

describe("pGetUsersPage tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("returns empty page when no users - test", async () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      prismaMock.user.count.mockResolvedValue(0);

      const result = await repo.pGetUsersPage();

      expect(result.content).toEqual([]);
      expect(result.totalElements).toBe(0);
      expect(result.pageNumber).toBe(0);
      expect(result.pageSize).toBe(20);
      expect(result.totalPages).toBe(0);
      expect(result.numberOfElements).toBe(0);
   });

   it("returns users page with defaults - test", async () => {
      const user = {
         ...ptestData.pUser(),
         subscription: null,
         subscriptionHistory: [],
      };
      prismaMock.user.findMany.mockResolvedValue([user] as never);
      prismaMock.user.count.mockResolvedValue(1);

      const result = await repo.pGetUsersPage();

      expect(result.content).toHaveLength(1);
      expect(result.content[0].id).toBe(user.id);
      expect(result.content[0].name).toBe(user.name);
      expect(result.content[0].email).toBe(user.email);
      expect(result.content[0].role).toBe(user.role);
      expect(result.content[0].subscriptionTier).toBeNull();
      expect(result.content[0].subscriptionStatus).toBeNull();
      expect(result.totalElements).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.numberOfElements).toBe(1);
      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
         expect.objectContaining({
            where: {},
            skip: 0,
            take: 20,
         })
      );
   });

   it("applies search filter - test", async () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      prismaMock.user.count.mockResolvedValue(0);

      await repo.pGetUsersPage({ filter: { search: "test" } });

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
         expect.objectContaining({
            where: {
               OR: [
                  { name: { contains: "test", mode: "insensitive" } },
                  { email: { contains: "test", mode: "insensitive" } },
               ],
            },
         })
      );
   });

   it("applies pagination - test", async () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      prismaMock.user.count.mockResolvedValue(0);

      await repo.pGetUsersPage({ pagination: { pageNumber: 2, pageSize: 5 } });

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
         expect.objectContaining({
            skip: 10,
            take: 5,
         })
      );
   });

   it("maps subscription data - test", async () => {
      const plan = ptestData.pSubscriptionPlan();
      const subscription = { ...ptestData.pSubscription(), plan };
      const user = {
         ...ptestData.pUser(),
         subscription,
         subscriptionHistory: [],
      };
      prismaMock.user.findMany.mockResolvedValue([user] as never);
      prismaMock.user.count.mockResolvedValue(1);

      const result = await repo.pGetUsersPage();

      expect(result.content[0].subscriptionTier).toBe(plan.tier);
      expect(result.content[0].subscriptionStatus).toBe(subscription.status);
   });
});

describe("pGetUserDetail tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("returns null when user not found - test", async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      const result = await repo.pGetUserDetail("user-id-1");

      expect(result).toBeNull();
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expect.objectContaining({
            where: { id: "user-id-1" },
         })
      );
   });

   it("returns user detail without subscription - test", async () => {
      const user = {
         ...ptestData.pUser(),
         subscription: null,
         subscriptionHistory: [],
      };
      prismaMock.user.findFirst.mockResolvedValue(user as never);

      const result = await repo.pGetUserDetail(user.id);

      expect(result).not.toBeNull();
      expect(result!.id).toBe(user.id);
      expect(result!.subscription).toBeNull();
      expect(result!.subscriptionHistory).toEqual([]);
   });

   it("returns user detail with subscription - test", async () => {
      const plan = ptestData.pSubscriptionPlan();
      const subscription = { ...ptestData.pSubscription(), plan };
      const history = ptestData.pSubscriptionHistory();
      const user = {
         ...ptestData.pUser(),
         subscription,
         subscriptionHistory: [history],
      };
      prismaMock.user.findFirst.mockResolvedValue(user as never);

      const result = await repo.pGetUserDetail(user.id);

      expect(result).not.toBeNull();
      expect(result!.subscription).not.toBeNull();
      expect(result!.subscription!.plan.id).toBe(plan.id);
      expect(result!.subscriptionHistory).toHaveLength(1);
      expect(result!.subscriptionHistory[0].eventType).toBe(history.eventType);
   });
});

describe("pUpdateUserRole tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("user updated - test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.update.mockResolvedValue(user);

      await repo.pUpdateUserRole(user.id, "admin");

      const expectedArgs: UserUpdateArgs = {
         where: { id: user.id },
         data: { role: "admin" },
      };

      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.update).toHaveBeenCalledWith(expectedArgs);
   });
});
