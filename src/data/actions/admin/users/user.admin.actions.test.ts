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

      await expect(getAdminUsersPage()).rejects.toThrow();
      expect(requireAdminMock).toHaveBeenCalledTimes(1);
      expect(sGetUsersPageMock).not.toHaveBeenCalled();
   });

   test("returns users page - test", async () => {
      requireAdminMock.mockResolvedValue(dtestData.dLoginUser());

      const usersPage = adtestData.dAdminUsersPage();
      sGetUsersPageMock.mockResolvedValue(usersPage);

      const result = await getAdminUsersPage();

      expect(result).toEqual(usersPage);
      expect(requireAdminMock).toHaveBeenCalledTimes(1);
      expect(sGetUsersPageMock).toHaveBeenCalledTimes(1);
      expect(sGetUsersPageMock).toHaveBeenCalledWith(undefined);
   });

   test("passes query to service - test", async () => {
      requireAdminMock.mockResolvedValue(dtestData.dLoginUser());
      sGetUsersPageMock.mockResolvedValue(adtestData.dAdminUsersPage());

      const query = {
         search: "test",
         pagination: { pageNumber: 1, pageSize: 5 },
      };
      await getAdminUsersPage(query);

      expect(sGetUsersPageMock).toHaveBeenCalledWith(query);
   });
});

describe("getAdminUserDetail tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("user not admin - test", async () => {
      const error = new Error("Forbidden");
      requireAdminMock.mockRejectedValue(error);

      await expect(
         getAdminUser("123e4567-e89b-12d3-a456-426614174000")
      ).rejects.toThrow();
   });

   test("returns null for invalid UUID - test", async () => {
      requireAdminMock.mockResolvedValue(dtestData.dLoginUser());

      const result = await getAdminUser("invalid-uuid");

      expect(result).toBeNull();
      expect(sGetUserDetailMock).not.toHaveBeenCalled();
   });

   test("returns null when user not found - test", async () => {
      requireAdminMock.mockResolvedValue(dtestData.dLoginUser());
      sGetUserDetailMock.mockResolvedValue(null);

      const result = await getAdminUser("123e4567-e89b-12d3-a456-426614174000");

      expect(result).toBeNull();
      expect(sGetUserDetailMock).toHaveBeenCalledTimes(1);
      expect(sGetUserDetailMock).toHaveBeenCalledWith(
         "123e4567-e89b-12d3-a456-426614174000"
      );
   });

   test("returns user detail - test", async () => {
      requireAdminMock.mockResolvedValue(dtestData.dLoginUser());
      const userDetail = adtestData.dAdminUserDetail();
      sGetUserDetailMock.mockResolvedValue(userDetail);

      const result = await getAdminUser("123e4567-e89b-12d3-a456-426614174000");

      expect(result).toEqual(userDetail);
      expect(sGetUserDetailMock).toHaveBeenCalledWith(
         "123e4567-e89b-12d3-a456-426614174000"
      );
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

   test("user not admin - test", async () => {
      const error = new Error("Forbidden");
      requireAdminMock.mockRejectedValue(error);

      const result = await updateUserRole(
         "123e4567-e89b-12d3-a456-426614174000",
         "admin"
      );

      const expected: ActionResult = {
         success: false,
         message: "Rolle konnte nicht aktualisiert werden.",
      };
      expect(result).toEqual(expected);
      expect(sUpdateUserRoleMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   test("returns error for invalid UUID - test", async () => {
      requireAdminMock.mockResolvedValue(dtestData.dLoginUser());

      const result = await updateUserRole("invalid-uuid", "admin");

      const expected: ActionResult = {
         success: false,
         message: "Rolle konnte nicht aktualisiert werden.",
      };
      expect(result).toEqual(expected);
      expect(sUpdateUserRoleMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   test("error - test", async () => {
      requireAdminMock.mockResolvedValue(dtestData.dLoginUser());
      const dbError = new Error("db error");
      sUpdateUserRoleMock.mockRejectedValue(dbError);

      const result = await updateUserRole(
         "123e4567-e89b-12d3-a456-426614174000",
         "user"
      );

      const expected: ActionResult = {
         success: false,
         message: "Rolle konnte nicht aktualisiert werden.",
      };
      expect(result).toEqual(expected);
      expect(sUpdateUserRoleMock).toHaveBeenCalledWith(
         "123e4567-e89b-12d3-a456-426614174000",
         "user"
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   test("updates role successfully - test", async () => {
      requireAdminMock.mockResolvedValue(dtestData.dLoginUser());
      sUpdateUserRoleMock.mockResolvedValue(undefined);

      const result = await updateUserRole(
         "123e4567-e89b-12d3-a456-426614174000",
         "admin"
      );

      const expected: ActionResult = {
         success: true,
         message: "Rolle erfolgreich aktualisiert.",
      };
      expect(result).toEqual(expected);
      expect(sUpdateUserRoleMock).toHaveBeenCalledTimes(1);
      expect(sUpdateUserRoleMock).toHaveBeenCalledWith(
         "123e4567-e89b-12d3-a456-426614174000",
         "admin"
      );
   });
});
