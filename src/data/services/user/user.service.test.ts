jest.mock("@/data/repositories/user");
jest.mock("@/data/services/cart");
jest.mock("@/data/services/library");
jest.mock("@/data/services/order");
jest.mock("@/data/services/iubenda");
jest.mock("@/lib/encrypt");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import MockDate from "mockdate";

import prisma from "@/data/repositories/prisma";
import { UserRepository } from "@/data/repositories/user";
import { ServiceFactory } from "@/data/services//service.factory";
import { CartService } from "@/data/services/cart";
import {
   IubendaService,
   LegalNoticesAcceptedParams,
} from "@/data/services/iubenda";
import { LibraryService } from "@/data/services/library";
import { OrderService } from "@/data/services/order";
import { UserUpdateData } from "@/data/types/db/user";
import {
   DUserAccountDelete,
   DUserCreate,
   DUserPasswordUpdate,
   DUserSignIn,
   DUserSignUp,
   DUserUpdate,
} from "@/data/types/domain/user";
import { compare, hash } from "@/lib/encrypt";

import { toDUser } from "./user.mapper";
import { UserService } from "./user.service";

const compareMock = compare as jest.MockedFunction<typeof compare>;
const hashMock = hash as jest.MockedFunction<typeof hash>;

const serviceFactory = new ServiceFactory(prisma);
const cartService = serviceFactory.getCartService();
const libraryService = serviceFactory.getLibraryService();
const orderService = serviceFactory.getOrderService();
const iubendaService = serviceFactory.getIubendaService();

const cartServiceMock = cartService as DeepMockProxy<CartService>;
const libraryServiceMock = libraryService as DeepMockProxy<LibraryService>;
const orderServiceMock = orderService as DeepMockProxy<OrderService>;
const iubendaServiceMock = iubendaService as DeepMockProxy<IubendaService>;

const userRepo = new UserRepository(prisma);
const userRepoMock = userRepo as DeepMockProxy<UserRepository>;

const userService = new UserService(
   userRepoMock,
   cartServiceMock,
   libraryServiceMock,
   orderServiceMock,
   iubendaServiceMock
);

describe("signUpUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      MockDate.set("2025-09-27");
   });

   afterEach(() => {
      MockDate.reset();
   });

   it("signUpUser - user created - iubenda synced true - test", async () => {
      const createdUser = dtestData.dUserInternal();
      userRepoMock.pCreateUser.mockResolvedValue(createdUser);

      const iubendaLegalNoticesSynced = true;
      iubendaServiceMock.saveLegalNoticesAccepted.mockResolvedValue(
         iubendaLegalNoticesSynced
      );

      const data: DUserSignUp = {
         name: "Test 1",
         email: "test1@email.com",
         password: "123456",
         confirmPassword: "123456",
         acceptTerms: true,
      };

      const result = await userService.signUpUser(data);

      const expectedResult = toDUser(createdUser);

      const expectedCreateData: DUserCreate = {
         name: data.name,
         email: data.email,
         hashedPassword: await hash(data.password),
         legalNoticesAcceptedAt: new Date("2025-09-27"),
      };

      const expectedLegalNoticesParams: LegalNoticesAcceptedParams = {
         user: createdUser,
         acceptedAt: expectedCreateData.legalNoticesAcceptedAt,
      };

      const expecteUserUpdateData: UserUpdateData = {
         iubendaLegalNoticesSynced,
      };

      expect(result).toEqual(expectedResult);
      expect(userRepoMock.pCreateUser).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pCreateUser).toHaveBeenCalledWith(expectedCreateData);
      expect(iubendaServiceMock.saveLegalNoticesAccepted).toHaveBeenCalledTimes(
         1
      );
      expect(iubendaServiceMock.saveLegalNoticesAccepted).toHaveBeenCalledWith(
         expectedLegalNoticesParams
      );
      expect(userRepoMock.pUpdateUser).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pUpdateUser).toHaveBeenCalledWith(
         createdUser.id,
         expecteUserUpdateData
      );
   });

   it("signUpUser - user created - iubenda synced false - test", async () => {
      const createdUser = dtestData.dUserInternal();
      userRepoMock.pCreateUser.mockResolvedValue(createdUser);

      const iubendaLegalNoticesSynced = false;
      iubendaServiceMock.saveLegalNoticesAccepted.mockResolvedValue(
         iubendaLegalNoticesSynced
      );

      const data: DUserSignUp = {
         name: "Test 1",
         email: "test1@email.com",
         password: "123456",
         confirmPassword: "123456",
         acceptTerms: true,
      };

      const result = await userService.signUpUser(data);

      const expectedResult = toDUser(createdUser);

      const expectedCreateData: DUserCreate = {
         name: data.name,
         email: data.email,
         hashedPassword: await hash(data.password),
         legalNoticesAcceptedAt: new Date("2025-09-27"),
      };

      const expectedLegalNoticesParams: LegalNoticesAcceptedParams = {
         user: createdUser,
         acceptedAt: expectedCreateData.legalNoticesAcceptedAt,
      };

      expect(result).toEqual(expectedResult);
      expect(userRepoMock.pCreateUser).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pCreateUser).toHaveBeenCalledWith(expectedCreateData);
      expect(iubendaServiceMock.saveLegalNoticesAccepted).toHaveBeenCalledTimes(
         1
      );
      expect(iubendaServiceMock.saveLegalNoticesAccepted).toHaveBeenCalledWith(
         expectedLegalNoticesParams
      );
      expect(userRepoMock.pUpdateUser).not.toHaveBeenCalled();
   });
});

describe("singInUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("singInUser - user null - test", async () => {
      userRepoMock.pGetUserByEmail.mockResolvedValue(null);

      const data: DUserSignIn = {
         email: "test@example.com",
         password: "password123",
      };

      const result = await userService.singInUser(data);

      expect(result).toBeNull();
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledWith(data.email);
   });

   it("singInUser - user.password is null - test", async () => {
      const user = dtestData.dUserInternal();
      user.password = null;
      userRepoMock.pGetUserByEmail.mockResolvedValue(user);

      const data: DUserSignIn = {
         email: "test@example.com",
         password: "password123",
      };

      const result = await userService.singInUser(data);

      expect(result).toBeNull();
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledWith(data.email);
   });

   it("singInUser - user.password compare false - test", async () => {
      const user = dtestData.dUserInternal();
      userRepoMock.pGetUserByEmail.mockResolvedValue(user);
      compareMock.mockResolvedValue(false);

      const data: DUserSignIn = {
         email: "test@example.com",
         password: "password123",
      };

      const result = await userService.singInUser(data);

      expect(result).toBeNull();
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledWith(data.email);
      expect(compareMock).toHaveBeenCalledTimes(1);
      expect(compareMock).toHaveBeenCalledWith(data.password, user.password);
   });

   it("singInUser - user.password compare true - test", async () => {
      const user = dtestData.dUserInternal();
      userRepoMock.pGetUserByEmail.mockResolvedValue(user);
      compareMock.mockResolvedValue(true);

      const data: DUserSignIn = {
         email: "test@example.com",
         password: "password123",
      };

      const result = await userService.singInUser(data);

      const expectedResult = {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
      };

      expect(result).toEqual(expectedResult);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledWith(data.email);
      expect(compareMock).toHaveBeenCalledTimes(1);
      expect(compareMock).toHaveBeenCalledWith(data.password, user.password);
   });
});

describe("getUserById tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getUserById - user null - test", async () => {
      const userId = "user-id-1";
      userRepoMock.pGetUserById.mockResolvedValue(null);

      const result = await userService.getUserById(userId);

      expect(result).toBeNull();
      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(userId);
   });

   it("getUserById - user retrieved - test", async () => {
      const user = dtestData.dUserInternal();
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const result = await userService.getUserById(user.id);

      const expectedResult = toDUser(user);

      expect(result).toEqual(expectedResult);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(user.id);
   });
});

describe("getUserStripeCustomerId tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getUserStripeCustomerId - user null - test", async () => {
      const userId = "user-id-1";
      userRepoMock.pGetUserById.mockResolvedValue(null);

      const result = await userService.getUserStripeCustomerId(userId);

      expect(result).toBeNull();
      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(userId);
   });

   it("getUserStripeCustomerId - user.stripeCustomerId null - test", async () => {
      const user = dtestData.dUserInternal();
      user.stripeCustomerId = null;
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const result = await userService.getUserStripeCustomerId(user.id);

      expect(result).toBeNull();
      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(user.id);
   });

   it("getUserStripeCustomerId - stripeCustomerId retrieved - test", async () => {
      const user = dtestData.dUserInternal();
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const result = await userService.getUserStripeCustomerId(user.id);

      expect(result).toEqual(user.stripeCustomerId);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(user.id);
   });
});

describe("updateUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updateUser - user updated - test", async () => {
      const userId = "user-id-1";
      const data: DUserUpdate = {
         name: "test 1",
      };

      await userService.updateUser(userId, data);

      const expectedData: UserUpdateData = {
         name: data.name,
      };

      expect(userRepoMock.pUpdateUser).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pUpdateUser).toHaveBeenCalledWith(
         userId,
         expectedData
      );
   });
});

describe("updateUserStripeCustomerId tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updateUserStripeCustomerId - stripeCustomerId updated - test", async () => {
      const userId = "user-id-1";
      const stripeCustomerId = "stripe-customer-id-1";

      await userService.updateUserStripeCustomerId(userId, stripeCustomerId);

      const expectedData: UserUpdateData = {
         stripeCustomerId,
      };
      expect(userRepoMock.pUpdateUser).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pUpdateUser).toHaveBeenCalledWith(
         userId,
         expectedData
      );
   });
});

describe("updateIubendaLegalNoticesSynced tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updateIubendaLegalNoticesSynced - sync status updated - test", async () => {
      const userId = "user-id-1";
      const iubendaLegalNoticesSynced = true;

      await userService.updateIubendaLegalNoticesSynced(
         userId,
         iubendaLegalNoticesSynced
      );

      const expecteUserUpdateData: UserUpdateData = {
         iubendaLegalNoticesSynced,
      };

      expect(userRepoMock.pUpdateUser).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pUpdateUser).toHaveBeenCalledWith(
         userId,
         expecteUserUpdateData
      );
   });
});

describe("updatePassword tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updatePassword - user null - test", async () => {
      const userId = "user-id-1";
      userRepoMock.pGetUserById.mockResolvedValue(null);

      const data: DUserPasswordUpdate = {
         currentPassword: "test123",
         newPassword: "12345679",
         confirmPassword: "12345679",
      };

      const fn = async () => await userService.updatePassword(userId, data);

      expect(fn).rejects.toThrow("User not found");
      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(userId);
      expect(compareMock).not.toHaveBeenCalled();
      expect(hashMock).not.toHaveBeenCalled();
   });

   it("updatePassword - user.password null - test", async () => {
      const user = dtestData.dUserInternal();
      user.password = null;
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const data: DUserPasswordUpdate = {
         currentPassword: "test123",
         newPassword: "12345679",
         confirmPassword: "12345679",
      };

      const fn = async () => await userService.updatePassword(user.id, data);

      expect(fn).rejects.toThrow("User doesn't have a password");
      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(user.id);
      expect(compareMock).not.toHaveBeenCalled();
      expect(hashMock).not.toHaveBeenCalled();
   });

   it("updatePassword - current password invalid - test", async () => {
      const user = dtestData.dUserInternal();
      userRepoMock.pGetUserById.mockResolvedValue(user);
      compareMock.mockResolvedValue(false);

      const data: DUserPasswordUpdate = {
         currentPassword: "test123",
         newPassword: "12345679",
         confirmPassword: "12345679",
      };

      const fn = async () => await userService.updatePassword(user.id, data);

      expect(fn).rejects.toThrow("Password cannot be updated");
      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(user.id);
      expect(hashMock).not.toHaveBeenCalled();
   });

   it("updatePassword - password updated - test", async () => {
      const user = dtestData.dUserInternal();
      userRepoMock.pGetUserById.mockResolvedValue(user);
      compareMock.mockResolvedValue(true);
      const hashedPassword = "hashed-password-1";
      hashMock.mockResolvedValue(hashedPassword);

      const data: DUserPasswordUpdate = {
         currentPassword: "test123",
         newPassword: "12345679",
         confirmPassword: "12345679",
      };

      await userService.updatePassword(user.id, data);

      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(user.id);
      expect(userRepoMock.pUpdatePassword).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pUpdatePassword).toHaveBeenCalledWith(
         user.id,
         hashedPassword
      );
      expect(compareMock).toHaveBeenCalledTimes(1);
      expect(compareMock).toHaveBeenCalledWith(
         data.currentPassword,
         user.password
      );
      expect(hashMock).toHaveBeenCalledTimes(1);
      expect(hashMock).toHaveBeenCalledWith(data.newPassword);
   });
});

describe("deleteUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("deleteUser - user null - test", async () => {
      const user = dtestData.dUserInternal();
      userRepoMock.pGetUserById.mockResolvedValue(null);

      const data: DUserAccountDelete = {
         password: "test123",
      };

      const fn = async () => await userService.deleteUser(user.id, data);

      expect(fn).rejects.toThrow("User not found");
      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(user.id);
      expect(compareMock).not.toHaveBeenCalled();
      expect(cartServiceMock.deleteCarts).not.toHaveBeenCalled();
      expect(libraryServiceMock.deleteLibraryEntries).not.toHaveBeenCalled();
      expect(orderServiceMock.deleteOrders).not.toHaveBeenCalled();
      expect(userRepoMock.pDeleteUser).not.toHaveBeenCalled();
   });

   it("deleteUser - user.password null - test", async () => {
      const user = dtestData.dUserInternal();
      user.password = null;
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const data: DUserAccountDelete = {
         password: "test123",
      };

      const fn = async () => await userService.deleteUser(user.id, data);

      expect(fn).rejects.toThrow("User doesn't have a password");
      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(user.id);
      expect(compareMock).not.toHaveBeenCalled();
      expect(cartServiceMock.deleteCarts).not.toHaveBeenCalled();
      expect(libraryServiceMock.deleteLibraryEntries).not.toHaveBeenCalled();
      expect(orderServiceMock.deleteOrders).not.toHaveBeenCalled();
      expect(userRepoMock.pDeleteUser).not.toHaveBeenCalled();
   });

   it("deleteUser - password invalid - test", async () => {
      const user = dtestData.dUserInternal();
      userRepoMock.pGetUserById.mockResolvedValue(user);
      compareMock.mockResolvedValue(false);

      const data: DUserAccountDelete = {
         password: "test123",
      };

      const fn = async () => await userService.deleteUser(user.id, data);

      expect(fn).rejects.toThrow("Account cannot be deleted");
      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(user.id);
      expect(cartServiceMock.deleteCarts).not.toHaveBeenCalled();
      expect(libraryServiceMock.deleteLibraryEntries).not.toHaveBeenCalled();
      expect(orderServiceMock.deleteOrders).not.toHaveBeenCalled();
      expect(userRepoMock.pDeleteUser).not.toHaveBeenCalled();
   });

   it("deleteUser - user deleted - test", async () => {
      const user = dtestData.dUserInternal();
      userRepoMock.pGetUserById.mockResolvedValue(user);
      compareMock.mockResolvedValue(true);

      const data: DUserAccountDelete = {
         password: "test123",
      };

      await userService.deleteUser(user.id, data);

      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(user.id);
      expect(cartServiceMock.deleteCarts).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.deleteCarts).toHaveBeenCalledWith(user.id);
      expect(libraryServiceMock.deleteLibraryEntries).toHaveBeenCalledTimes(1);
      expect(libraryServiceMock.deleteLibraryEntries).toHaveBeenCalledWith(
         user.id
      );
      expect(orderServiceMock.deleteOrders).toHaveBeenCalledTimes(1);
      expect(orderServiceMock.deleteOrders).toHaveBeenCalledWith(user.id);
      expect(userRepoMock.pDeleteUser).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pDeleteUser).toHaveBeenCalledWith(user.id);
      expect(compareMock).toHaveBeenCalledTimes(1);
      expect(compareMock).toHaveBeenCalledWith(data.password, user.password);
   });
});
