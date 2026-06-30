jest.mock("@/data/actions/auth-utils");
jest.mock("@/data/repositories/admin");

import { dtestData } from "@tests";

import { requireAdmin } from "@/data/actions/auth-utils";
import { AdminUserRepository } from "@/data/repositories/admin";
import { DAdminUserDetail, DAdminUsersPage } from "@/data/types/domain/admin";
import { ActionResult } from "@/data/types/utils";

import {
   getAdminUserDetail,
   getAdminUsersPage,
   updateUserRole,
} from "./user.admin.actions";

const requireAdminUserMock = requireAdmin as jest.MockedFunction<
   typeof requireAdmin
>;

const mockPGetUsersPage = AdminUserRepository.prototype
   .pGetUsersPage as jest.MockedFunction<
   typeof AdminUserRepository.prototype.pGetUsersPage
>;
const mockPGetUserDetail = AdminUserRepository.prototype
   .pGetUserDetail as jest.MockedFunction<
   typeof AdminUserRepository.prototype.pGetUserDetail
>;
const mockPUpdateUserRole = AdminUserRepository.prototype
   .pUpdateUserRole as jest.MockedFunction<
   typeof AdminUserRepository.prototype.pUpdateUserRole
>;

const dAdminUser = dtestData.dLoginUser();

const mockUsersPage: DAdminUsersPage = {
   content: [],
   pageNumber: 0,
   pageSize: 20,
   totalElements: 0,
   totalPages: 0,
   numberOfElements: 0,
};

const mockUserDetail: DAdminUserDetail = {
   id: dAdminUser.id,
   name: dAdminUser.name ?? "Test User",
   email: dAdminUser.email ?? "test@test.com",
   role: "admin",
   emailVerified: null,
   subscriptionTier: null,
   subscriptionStatus: null,
   stripeCustomerId: null,
   trialEndsAt: null,
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
   subscription: null,
   subscriptionHistory: [],
};

describe("getAdminUsersPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("throws when not admin - test", async () => {
      const error = new Error("Forbidden");
      requireAdminUserMock.mockRejectedValue(error);

      await expect(getAdminUsersPage()).rejects.toThrow();
      expect(requireAdminUserMock).toHaveBeenCalledTimes(1);
      expect(mockPGetUsersPage).not.toHaveBeenCalled();
   });

   it("returns users page - test", async () => {
      requireAdminUserMock.mockResolvedValue(dAdminUser);
      mockPGetUsersPage.mockResolvedValue(mockUsersPage);

      const result = await getAdminUsersPage();

      expect(result).toEqual(mockUsersPage);
      expect(requireAdminUserMock).toHaveBeenCalledTimes(1);
      expect(mockPGetUsersPage).toHaveBeenCalledTimes(1);
   });

   it("passes query to repository - test", async () => {
      requireAdminUserMock.mockResolvedValue(dAdminUser);
      mockPGetUsersPage.mockResolvedValue(mockUsersPage);

      const query = {
         search: "test",
         pagination: { pageNumber: 1, pageSize: 5 },
      };
      await getAdminUsersPage(query);

      expect(mockPGetUsersPage).toHaveBeenCalledWith(query);
   });
});

describe("getAdminUserDetail tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("returns null for invalid UUID - test", async () => {
      requireAdminUserMock.mockResolvedValue(dAdminUser);

      const result = await getAdminUserDetail("invalid-uuid");

      expect(result).toBeNull();
      expect(mockPGetUserDetail).not.toHaveBeenCalled();
   });

   it("returns null when user not found - test", async () => {
      requireAdminUserMock.mockResolvedValue(dAdminUser);
      mockPGetUserDetail.mockResolvedValue(null);

      const result = await getAdminUserDetail(
         "123e4567-e89b-12d3-a456-426614174000"
      );

      expect(result).toBeNull();
      expect(mockPGetUserDetail).toHaveBeenCalledTimes(1);
   });

   it("returns user detail - test", async () => {
      requireAdminUserMock.mockResolvedValue(dAdminUser);
      mockPGetUserDetail.mockResolvedValue(mockUserDetail);

      const result = await getAdminUserDetail(
         "123e4567-e89b-12d3-a456-426614174000"
      );

      expect(result).toEqual(mockUserDetail);
      expect(mockPGetUserDetail).toHaveBeenCalledWith(
         "123e4567-e89b-12d3-a456-426614174000"
      );
   });

   it("throws when not admin - test", async () => {
      const error = new Error("Forbidden");
      requireAdminUserMock.mockRejectedValue(error);

      await expect(
         getAdminUserDetail("123e4567-e89b-12d3-a456-426614174000")
      ).rejects.toThrow();
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

   it("returns error for invalid UUID - test", async () => {
      requireAdminUserMock.mockResolvedValue(dAdminUser);

      const result = await updateUserRole("invalid-uuid", "admin");

      const expected: ActionResult = {
         success: false,
         message: "Rolle konnte nicht aktualisiert werden.",
      };
      expect(result).toEqual(expected);
      expect(mockPUpdateUserRole).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("returns error when not admin - test", async () => {
      const error = new Error("Forbidden");
      requireAdminUserMock.mockRejectedValue(error);

      const result = await updateUserRole(
         "123e4567-e89b-12d3-a456-426614174000",
         "user"
      );

      const expected: ActionResult = {
         success: false,
         message: "Rolle konnte nicht aktualisiert werden.",
      };
      expect(result).toEqual(expected);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("returns success - test", async () => {
      requireAdminUserMock.mockResolvedValue(dAdminUser);
      mockPUpdateUserRole.mockResolvedValue(undefined);

      const result = await updateUserRole(
         "123e4567-e89b-12d3-a456-426614174000",
         "admin"
      );

      const expected: ActionResult = {
         success: true,
         message: "Rolle erfolgreich aktualisiert.",
      };
      expect(result).toEqual(expected);
      expect(mockPUpdateUserRole).toHaveBeenCalledWith(
         "123e4567-e89b-12d3-a456-426614174000",
         "admin"
      );
   });

   it("returns error on repository failure - test", async () => {
      requireAdminUserMock.mockResolvedValue(dAdminUser);
      const error = new Error("db error");
      mockPUpdateUserRole.mockRejectedValue(error);

      const result = await updateUserRole(
         "123e4567-e89b-12d3-a456-426614174000",
         "user"
      );

      const expected: ActionResult = {
         success: false,
         message: "Rolle konnte nicht aktualisiert werden.",
      };
      expect(result).toEqual(expected);
      expect(console.error).toHaveBeenCalledWith("db error");
   });
});
