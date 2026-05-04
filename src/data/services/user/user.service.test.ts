jest.mock("@/data/repositories/user");
jest.mock("@/data/services/cart");
jest.mock("@/data/services/order");
jest.mock("@/data/services/iubenda");
jest.mock("@/data/services/user");
jest.mock("@/lib/encrypt");
jest.mock("@/lib/utils");

import { dtestData, ntestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import MockDate from "mockdate";
import { headers } from "next/headers";

import prisma from "@/data/repositories/prisma";
import { UserRepository } from "@/data/repositories/user";
import { ServiceFactory } from "@/data/services//service.factory";
import { CartService } from "@/data/services/cart";
import {
   IubendaService,
   LegalNoticesAcceptedParams,
} from "@/data/services/iubenda";
import { OrderService } from "@/data/services/order";
import { VerificationTokenService } from "@/data/services/user";
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
import { resolveIpAddresse } from "@/lib/utils";

import { toDUser } from "./user.mapper";
import { UserService } from "./user.service";

const compareMock = compare as jest.MockedFunction<typeof compare>;
const hashMock = hash as jest.MockedFunction<typeof hash>;

const headersMock = headers as jest.MockedFunction<typeof headers>;
const resolveIpAddresseMock = resolveIpAddresse as jest.MockedFunction<
   typeof resolveIpAddresse
>;

const serviceFactory = new ServiceFactory(prisma);
const cartService = serviceFactory.getCartService();
const orderService = serviceFactory.getOrderService();
const iubendaService = serviceFactory.getIubendaService();
const verificationTokenService = serviceFactory.getVerificationTokenService();

const cartServiceMock = cartService as DeepMockProxy<CartService>;
const orderServiceMock = orderService as DeepMockProxy<OrderService>;
const iubendaServiceMock = iubendaService as DeepMockProxy<IubendaService>;
const verificationTokenServiceMock =
   verificationTokenService as DeepMockProxy<VerificationTokenService>;

const userRepo = new UserRepository(prisma);
const userRepoMock = userRepo as DeepMockProxy<UserRepository>;

const userService = new UserService(
   userRepoMock,
   verificationTokenServiceMock,
   cartServiceMock,
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

   it("user created - iubenda synced true - test", async () => {
      const createdUser = dtestData.dUserInternal();
      userRepoMock.pCreateUser.mockResolvedValue(createdUser);
      verificationTokenServiceMock.sendVerificationEmail.mockResolvedValue();

      const reqHeader = ntestData.headers();
      headersMock.mockResolvedValue(reqHeader);

      const ipAddress = "10.0.0.1";
      resolveIpAddresseMock.mockReturnValue(ipAddress);

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
         ipAddress: ipAddress,
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
      expect(
         verificationTokenServiceMock.sendVerificationEmail
      ).toHaveBeenCalledTimes(1);
      expect(
         verificationTokenServiceMock.sendVerificationEmail
      ).toHaveBeenCalledWith(createdUser.email, createdUser.name);
   });

   it("signUpUser - user created - iubenda synced false - test", async () => {
      const createdUser = dtestData.dUserInternal();
      userRepoMock.pCreateUser.mockResolvedValue(createdUser);
      verificationTokenServiceMock.sendVerificationEmail.mockResolvedValue();

      const reqHeader = ntestData.headers();
      headersMock.mockResolvedValue(reqHeader);

      resolveIpAddresseMock.mockReturnValue(undefined);

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
      expect(
         verificationTokenServiceMock.sendVerificationEmail
      ).toHaveBeenCalledTimes(1);
      expect(
         verificationTokenServiceMock.sendVerificationEmail
      ).toHaveBeenCalledWith(createdUser.email, createdUser.name);
   });
});

describe("singInUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("user null - test", async () => {
      userRepoMock.pGetUserByEmail.mockResolvedValue(null);

      const data: DUserSignIn = {
         email: "test@example.com",
         password: "password123",
      };

      const result = await userService.singInUser(data);

      expect(result).toBeNull();
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledWith(data.email);
      expect(compareMock).not.toHaveBeenCalled();
   });

   it("user.password is null - test", async () => {
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
      expect(compareMock).not.toHaveBeenCalled();
   });

   it("user.password compare false - test", async () => {
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

   it("user.password compare true - email verified null - test", async () => {
      const user = dtestData.dUserInternal();
      user.emailVerified = null;
      userRepoMock.pGetUserByEmail.mockResolvedValue(user);
      compareMock.mockResolvedValue(true);

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

   it("user.password compare true - email verified - test", async () => {
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

   it("user null - test", async () => {
      const userId = "user-id-1";
      userRepoMock.pGetUserById.mockResolvedValue(null);

      const result = await userService.getUserById(userId);

      expect(result).toBeNull();
      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(userId);
   });

   it("user retrieved - test", async () => {
      const user = dtestData.dUserInternal();
      userRepoMock.pGetUserById.mockResolvedValue(user);

      const result = await userService.getUserById(user.id);

      const expectedResult = toDUser(user);

      expect(result).toEqual(expectedResult);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserById).toHaveBeenCalledWith(user.id);
   });
});

describe("getUserByEmail tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("user null - test", async () => {
      const email = "test@email.com";
      userRepoMock.pGetUserByEmail.mockResolvedValue(null);

      const result = await userService.getUserByEmail(email);

      expect(result).toBeNull();
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledWith(email);
   });

   it("user retrieved - test", async () => {
      const user = dtestData.dUserInternal();
      userRepoMock.pGetUserByEmail.mockResolvedValue(user);

      const result = await userService.getUserByEmail(user.email);

      const expectedResult = toDUser(user);

      expect(result).toEqual(expectedResult);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetUserByEmail).toHaveBeenCalledWith(user.email);
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

   it("user null - test", async () => {
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
      expect(orderServiceMock.deleteOrders).not.toHaveBeenCalled();
      expect(userRepoMock.pDeleteUser).not.toHaveBeenCalled();
   });

   it("user.password null - test", async () => {
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
      expect(orderServiceMock.deleteOrders).not.toHaveBeenCalled();
      expect(userRepoMock.pDeleteUser).not.toHaveBeenCalled();
   });

   it("password invalid - test", async () => {
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
      expect(orderServiceMock.deleteOrders).not.toHaveBeenCalled();
      expect(userRepoMock.pDeleteUser).not.toHaveBeenCalled();
   });

   it("user deleted - test", async () => {
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
      expect(orderServiceMock.deleteOrders).toHaveBeenCalledTimes(1);
      expect(orderServiceMock.deleteOrders).toHaveBeenCalledWith(user.id);
      expect(userRepoMock.pDeleteUser).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pDeleteUser).toHaveBeenCalledWith(user.id);
      expect(compareMock).toHaveBeenCalledTimes(1);
      expect(compareMock).toHaveBeenCalledWith(data.password, user.password);
   });
});

describe("saveLegalNoticesAccepted tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("saveLegalNoticesAccepted - iubenda synced true - test", async () => {
      const user = dtestData.dUserInternal();

      const reqHeader = ntestData.headers();
      headersMock.mockResolvedValue(reqHeader);

      const ipAddress = "10.0.0.1";
      resolveIpAddresseMock.mockReturnValue(ipAddress);

      const iubendaLegalNoticesSynced = true;
      iubendaServiceMock.saveLegalNoticesAccepted.mockResolvedValue(
         iubendaLegalNoticesSynced
      );

      const acceptedAt = new Date();
      await userService.saveLegalNoticesAccepted(user, acceptedAt);

      const expectedLegalNoticesParams: LegalNoticesAcceptedParams = {
         user,
         acceptedAt,
         ipAddress,
      };

      const expecteUserUpdateData: UserUpdateData = {
         iubendaLegalNoticesSynced,
      };

      expect(iubendaServiceMock.saveLegalNoticesAccepted).toHaveBeenCalledTimes(
         1
      );
      expect(iubendaServiceMock.saveLegalNoticesAccepted).toHaveBeenCalledWith(
         expectedLegalNoticesParams
      );
      expect(userRepoMock.pUpdateUser).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pUpdateUser).toHaveBeenCalledWith(
         user.id,
         expecteUserUpdateData
      );
   });

   it("signUpUser - user created - iubenda synced false - test", async () => {
      const user = dtestData.dUserInternal();
      userRepoMock.pCreateUser.mockResolvedValue(user);

      const reqHeader = ntestData.headers();
      headersMock.mockResolvedValue(reqHeader);

      resolveIpAddresseMock.mockReturnValue(undefined);

      const iubendaLegalNoticesSynced = false;
      iubendaServiceMock.saveLegalNoticesAccepted.mockResolvedValue(
         iubendaLegalNoticesSynced
      );

      const acceptedAt = new Date();
      await userService.saveLegalNoticesAccepted(user, acceptedAt);

      const expectedLegalNoticesParams: LegalNoticesAcceptedParams = {
         user,
         acceptedAt,
      };

      expect(iubendaServiceMock.saveLegalNoticesAccepted).toHaveBeenCalledTimes(
         1
      );
      expect(iubendaServiceMock.saveLegalNoticesAccepted).toHaveBeenCalledWith(
         expectedLegalNoticesParams
      );
      expect(userRepoMock.pUpdateUser).not.toHaveBeenCalled();
   });
});

describe("isEmailVerified tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("user not found - test", async () => {
      const email = "test@email.com";
      userRepoMock.pGetEmailVerified.mockResolvedValue(null);

      const result = await userService.isEmailVerified(email);

      expect(result).toBeNull();
      expect(userRepoMock.pGetEmailVerified).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetEmailVerified).toHaveBeenCalledWith(email);
   });

   it("email verified false - test", async () => {
      const email = "test@email.com";
      userRepoMock.pGetEmailVerified.mockResolvedValue(false);

      const result = await userService.isEmailVerified(email);

      expect(result).toBe(false);
      expect(userRepoMock.pGetEmailVerified).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetEmailVerified).toHaveBeenCalledWith(email);
   });

   it("email verified true - test", async () => {
      const email = "test@email.com";
      userRepoMock.pGetEmailVerified.mockResolvedValue(true);

      const result = await userService.isEmailVerified(email);

      expect(result).toBe(true);
      expect(userRepoMock.pGetEmailVerified).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pGetEmailVerified).toHaveBeenCalledWith(email);
   });
});

describe("verifyEmail tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("user updated - test", async () => {
      const email = "test@email.com";

      await userService.verifyEmail(email);

      expect(userRepoMock.pVerifyUserEmail).toHaveBeenCalledTimes(1);
      expect(userRepoMock.pVerifyUserEmail).toHaveBeenCalledWith(email);
   });
});
