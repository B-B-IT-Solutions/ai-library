jest.mock("@/data/repositories/admin/user");

import { adtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { AdminUserRepository } from "@/data/repositories/admin/user";
import prisma from "@/data/repositories/prisma";

import { AdminUserService } from "./user.admin.service";

const userRepo = new AdminUserRepository(prisma);
const userRepoMock = userRepo as DeepMockProxy<AdminUserRepository>;

const service = new AdminUserService(userRepoMock);

describe("getUsersPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("page retrieved - test", async () => {
      const usersPage = adtestData.dAdminUsersPage();
      userRepoMock.pGetUsersPage.mockResolvedValue(usersPage);

      const query = adtestData.dAdminUsersPageQuery();
      const result = await service.getUsersPage(query);

      expect(result).toEqual(usersPage);
      expect(userRepoMock.pGetUsersPage).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUsersPage).toHaveBeenCalledWith(query);
   });
});

describe("getUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("user retrieved - test", async () => {
      const user = adtestData.dAdminUser();
      userRepoMock.pGetUser.mockResolvedValue(user);

      const result = await service.getUser(user.id);

      expect(result).toEqual(user);
      expect(userRepoMock.pGetUser).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUser).toHaveBeenCalledWith(user.id);
   });
});

describe("updateUserRole tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("user updated - test", async () => {
      userRepoMock.pUpdateUserRole.mockResolvedValue(undefined);

      const userId = "user-id-1";

      await service.updateUserRole(userId, "admin");

      expect(userRepoMock.pUpdateUserRole).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pUpdateUserRole).toHaveBeenCalledWith(
         userId,
         "admin"
      );
   });
});
