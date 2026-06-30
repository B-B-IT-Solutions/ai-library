jest.mock("@/data/repositories/admin");

import { adtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { AdminUserRepository } from "@/data/repositories/admin";
import prisma from "@/data/repositories/prisma";
import { DAdminUsersPageQuery } from "@/data/types/domain/admin/admin";

import { AdminUserService } from "./user.admin.service";

const repo = new AdminUserRepository(prisma);
const repoMock = repo as DeepMockProxy<AdminUserRepository>;

const service = new AdminUserService(repoMock);

describe("getUsersPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("returns users page from repository - test", async () => {
      const usersPage = adtestData.dAdminUsersPage();
      repoMock.pGetUsersPage.mockResolvedValue(usersPage);

      const result = await service.getUsersPage();

      expect(result).toEqual(usersPage);
      expect(repoMock.pGetUsersPage).toHaveBeenCalledTimes(1);
      expect(repoMock.pGetUsersPage).toHaveBeenCalledWith(undefined);
   });

   test("passes query to repository - test", async () => {
      const usersPage = adtestData.dAdminUsersPage();
      repoMock.pGetUsersPage.mockResolvedValue(usersPage);

      const query: DAdminUsersPageQuery = {
         search: "test",
         pagination: { pageNumber: 1, pageSize: 10 },
      };
      await service.getUsersPage(query);

      expect(repoMock.pGetUsersPage).toHaveBeenCalledWith(query);
   });
});

describe("getUserDetail tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("returns null when user not found - test", async () => {
      repoMock.pGetUserDetail.mockResolvedValue(null);

      const result = await service.getUserDetail("user-id-1");

      expect(result).toBeNull();
      expect(repoMock.pGetUserDetail).toHaveBeenCalledTimes(1);
      expect(repoMock.pGetUserDetail).toHaveBeenCalledWith("user-id-1");
   });

   test("returns user detail - test", async () => {
      const userDetail = adtestData.dAdminUserDetail();
      repoMock.pGetUserDetail.mockResolvedValue(userDetail);

      const result = await service.getUserDetail("user-id-1");

      expect(result).toEqual(userDetail);
      expect(repoMock.pGetUserDetail).toHaveBeenCalledWith("user-id-1");
   });
});

describe("updateUserRole tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("delegates to repository - test", async () => {
      repoMock.pUpdateUserRole.mockResolvedValue(undefined);

      await service.updateUserRole("user-id-1", "admin");

      expect(repoMock.pUpdateUserRole).toHaveBeenCalledTimes(1);
      expect(repoMock.pUpdateUserRole).toHaveBeenCalledWith("user-id-1", "admin");
   });
});
