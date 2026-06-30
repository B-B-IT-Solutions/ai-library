jest.mock("@/data/actions/auth-utils");
jest.mock("@/data/services/admin/user");

import { adtestData, dtestData } from "@tests";

import { requireAdmin } from "@/data/actions/auth-utils";
import { AdminUserService } from "@/data/services/admin/user";
import { ActionResult } from "@/data/types/utils";

import {
   getAdminUser,
   getAdminUsersPage,
   updateUserRole,
} from "./user.admin.actions";

const sGetUsersPage = AdminUserService.prototype.getUsersPage;
const sGetUserDetail = AdminUserService.prototype.getUserDetail;
const sUpdateUserRole = AdminUserService.prototype.updateUserRole;

const requireAdminMock = requireAdmin as jest.MockedFunction<
   typeof requireAdmin
>;

const sGetUsersPageMock = sGetUsersPage as jest.MockedFunction<
   typeof sGetUsersPage
>;
const sGetUserDetailMock = sGetUserDetail as jest.MockedFunction<
   typeof sGetUserDetail
>;
const sUpdateUserRoleMock = sUpdateUserRole as jest.MockedFunction<
   typeof sUpdateUserRole
>;

describe("getAdminUsersPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("user not admin - test", async () => {
      const error = new Error("Forbidden");
      requireAdminMock.mockRejectedValue(error);

      const fn = () => getAdminUsersPage();

      await expect(fn).rejects.toThrow();
      expect(requireAdminMock).toHaveBeenCalledTimes(1);
      expect(sGetUsersPageMock).not.toHaveBeenCalled();
   });

   test("users retrieved - test", async () => {
      const adminUser = dtestData.dLoginUser();
      requireAdminMock.mockResolvedValue(adminUser);

      const page = adtestData.dAdminUsersPage();
      sGetUsersPageMock.mockResolvedValue(page);

      const query = adtestData.dAdminUsersPageQuery();

      const result = await getAdminUsersPage(query);

      expect(result).toEqual(page);
      expect(requireAdminMock).toHaveBeenCalledTimes(1);
      expect(sGetUsersPageMock).toHaveBeenCalledTimes(1);
      expect(sGetUsersPageMock).toHaveBeenCalledWith(query);
   });
});

describe("getAdminUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("invalid UUID - test", async () => {
      const result = await getAdminUser("invalid-uuid");

      expect(result).toBeNull();
      expect(requireAdminMock).not.toHaveBeenCalled();
      expect(sGetUserDetailMock).not.toHaveBeenCalled();
   });

   test("user not admin - test", async () => {
      const error = new Error("Forbidden");
      requireAdminMock.mockRejectedValue(error);

      const userId = "123e4567-e89b-12d3-a456-426614174000";

      const fn = () => getAdminUser(userId);

      await expect(fn).rejects.toThrow();
      expect(requireAdminMock).toHaveBeenCalledTimes(1);
      expect(sGetUserDetailMock).not.toHaveBeenCalled();
   });

   test("user retrieved - test", async () => {
      const adminUser = dtestData.dLoginUser();
      requireAdminMock.mockResolvedValue(adminUser);

      const user = adtestData.dAdminUserDetail();
      sGetUserDetailMock.mockResolvedValue(user);

      const userId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await getAdminUser(userId);

      expect(result).toEqual(user);
      expect(requireAdminMock).toHaveBeenCalledTimes(1);
      expect(sGetUserDetailMock).toHaveBeenCalledTimes(1);
      expect(sGetUserDetailMock).toHaveBeenCalledWith(userId);
   });
});

describe("updateUserRole tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   test("invalid UUID - test", async () => {
      const userId = "invalid-uuid";

      const result = await updateUserRole(userId, "admin");

      const expected: ActionResult = {
         success: false,
         message: "Rolle konnte nicht aktualisiert werden.",
      };
      expect(result).toEqual(expected);
      expect(requireAdminMock).not.toHaveBeenCalled();
      expect(sUpdateUserRoleMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   test("user not admin - test", async () => {
      const error = new Error("Forbidden");
      requireAdminMock.mockRejectedValue(error);

      const userId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await updateUserRole(userId, "admin");

      const expected: ActionResult = {
         success: false,
         message: "Rolle konnte nicht aktualisiert werden.",
      };

      expect(result).toEqual(expected);
      expect(requireAdminMock).toHaveBeenCalledTimes(1);
      expect(sUpdateUserRoleMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   test("user updated - test", async () => {
      const adminUser = dtestData.dLoginUser();
      requireAdminMock.mockResolvedValue(adminUser);

      sUpdateUserRoleMock.mockResolvedValue(undefined);

      const userId = "123e4567-e89b-12d3-a456-426614174000";

      const result = await updateUserRole(userId, "admin");

      const expected: ActionResult = {
         success: true,
         message: "Rolle erfolgreich aktualisiert.",
      };

      expect(result).toEqual(expected);
      expect(requireAdminMock).toHaveBeenCalledTimes(1);
      expect(sUpdateUserRoleMock).toHaveBeenCalledTimes(1);
      expect(sUpdateUserRoleMock).toHaveBeenCalledWith(userId, "admin");
   });
});
