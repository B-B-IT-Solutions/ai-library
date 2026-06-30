import { PrismaClient } from "@prisma/client";
import { adtestData, aptestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DAdminUsersPage } from "@/data/types/domain/admin/user";
import {
   UserCountArgs,
   UserFindFirstArgs,
   UserFindManyArgs,
   UserUpdateArgs,
   UserWhereInput,
} from "@/generated/prisma/models";

import { toDAdminUser, toDAdminUsers } from "./user.admin.mapper";
import { AdminUserRepository } from "./user.admin.repository";
import { resolveWhereInput } from "./utils";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const repo = new AdminUserRepository(prismaMock);

describe("pGetUsersPage tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("page retrieved - query undefined - test", async () => {
      const users = aptestData.pUsersWithSubscription();
      const totalElements = 11;
      prismaMock.user.findMany.mockResolvedValue(users);
      prismaMock.user.count.mockResolvedValue(totalElements);

      const result = await repo.pGetUsersPage();

      const expectedResult: DAdminUsersPage = {
         content: toDAdminUsers(users),
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: users.length,
         totalPages: Math.ceil(totalElements / 20),
         totalElements,
      };

      const expectedWhere: UserWhereInput = resolveWhereInput();

      const expectedFindMayArgs: UserFindManyArgs = {
         where: expectedWhere,
         include: {
            subscription: { include: { plan: true } },
         },
         orderBy: { createdAt: "desc" as const },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: UserCountArgs = {
         where: expectedWhere,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
      expect(prismaMock.user.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   it("page retrieved - query defined - test", async () => {
      const users = aptestData.pUsersWithSubscription();
      const totalElements = 11;
      prismaMock.user.findMany.mockResolvedValue(users);
      prismaMock.user.count.mockResolvedValue(totalElements);

      const query = adtestData.dAdminUsersPageQuery();
      const result = await repo.pGetUsersPage(query);

      const expectedResult: DAdminUsersPage = {
         content: toDAdminUsers(users),
         pageNumber: 1,
         pageSize: 10,
         numberOfElements: users.length,
         totalPages: Math.ceil(totalElements / 10),
         totalElements,
      };

      const expectedWhere: UserWhereInput = resolveWhereInput(query);

      const expectedFindMayArgs: UserFindManyArgs = {
         where: expectedWhere,
         include: {
            subscription: { include: { plan: true } },
         },
         orderBy: { createdAt: "desc" as const },
         skip: 10,
         take: 10,
      };

      const expectedCountArgs: UserCountArgs = {
         where: expectedWhere,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
      expect(prismaMock.user.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.count).toHaveBeenCalledWith(expectedCountArgs);
   });
});

describe("pGetUser tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("user null - test", async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      const userId = "user-id-1";
      const result = await repo.pGetUser(userId);

      const expectedArgs: UserFindFirstArgs = {
         where: { id: userId },
         include: {
            subscription: { include: { plan: true } },
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(expectedArgs);
   });

   it("user retrieved - test", async () => {
      const user = aptestData.pUserWithSubscription();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await repo.pGetUser(user.id);

      const expectedResult = toDAdminUser(user);

      const expectedArgs: UserFindFirstArgs = {
         where: { id: user.id },
         include: {
            subscription: { include: { plan: true } },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(expectedArgs);
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
