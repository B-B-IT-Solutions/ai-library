import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";
import MockDate from "mockdate";

import prisma from "@/data/repositories/prisma";
import {
   AccountDeleteManyArgs,
   SessionDeleteManyArgs,
   UserCreateArgs,
   UserCreateInput,
   UserDeleteArgs,
   UserFindFirstArgs,
   UserUpdateArgs,
} from "@/generated/prisma/models";

import { toDUserInternal } from "./user.mapper";
import { UserRepository } from "./user.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const userRepository = new UserRepository(prismaMock);

describe("pGetUserById tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("user null -  test", async () => {
      const userId = "user-id-1";
      prismaMock.user.findFirst.mockResolvedValue(null);

      const result = await userRepository.pGetUserById(userId);

      const expectedFindFirstArgs: UserFindFirstArgs = {
         where: {
            id: userId,
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   test("user retrieved - test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await userRepository.pGetUserById(user.id);

      const expectedResult = toDUserInternal(user);

      const expectedFindFirstArgs: UserFindFirstArgs = {
         where: {
            id: user.id,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });
});

describe("pGetUserByEmail tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("user null -  test", async () => {
      const email = "email1@test.cz";
      prismaMock.user.findFirst.mockResolvedValue(null);

      const result = await userRepository.pGetUserByEmail(email);

      const expectedFindFirstArgs: UserFindFirstArgs = {
         where: {
            email: email,
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   test("user retrieved -  test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await userRepository.pGetUserByEmail(user.email);

      const expectedResult = toDUserInternal(user);

      const expectedFindFirstArgs: UserFindFirstArgs = {
         where: {
            email: user.email,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });
});

describe("pGetUser tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("by userId - test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await userRepository.pGetUser({ userId: user.id });

      const expectedResult = toDUserInternal(user);

      const expectedFindFirstArgs: UserFindFirstArgs = {
         where: { id: user.id },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   test("by email - test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await userRepository.pGetUser({ email: user.email });

      const expectedResult = toDUserInternal(user);

      const expectedFindFirstArgs: UserFindFirstArgs = {
         where: { email: user.email },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   test("params undefined - test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await userRepository.pGetUser({});

      expect(result).toBeNull();
      expect(prismaMock.user.findFirst).not.toHaveBeenCalled();
   });
});

describe("pCreateUser tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pCreateUser - user created - test", async () => {
      const newUser = ptestData.pUser();
      prismaMock.user.create.mockResolvedValue(newUser);

      const createData = dtestData.dUserCreate();
      const result = await userRepository.pCreateUser(createData);

      const expectedResult = toDUserInternal(newUser);

      const expectedInput: UserCreateInput = {
         name: createData.name,
         email: createData.email,
         password: createData.hashedPassword,
         legalNoticesAcceptedAt: createData.legalNoticesAcceptedAt,
         trialEndsAt: createData.trialEndsAt,
      };

      const expectedCreateArgs: UserCreateArgs = {
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.create).toHaveBeenCalledWith(expectedCreateArgs);
   });
});

describe("pUpdateUser tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pUpdateUser - user updated - test", async () => {
      const userId = "user-id-1";
      const data = ptestData.pUserUpdateData();
      prismaMock.user.update.mockResolvedValue(data);

      const result = await userRepository.pUpdateUser(userId, data);

      const expectedUpdateArgs: UserUpdateArgs = {
         where: { id: userId },
         data: data,
      };

      expect(result).toEqual(data);
      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.update).toHaveBeenCalledWith(expectedUpdateArgs);
   });
});

describe("pUpdatePassword tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pUpdatePassword - password updated - test", async () => {
      const userId = "user-id-1";
      const password = "pwd-123";
      const data = ptestData.pUserUpdateData();
      prismaMock.user.update.mockResolvedValue(data);

      const result = await userRepository.pUpdatePassword(userId, password);

      const expectedUpdateArgs: UserUpdateArgs = {
         where: { id: userId },
         data: { password },
      };

      expect(result).toEqual(data);
      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.update).toHaveBeenCalledWith(expectedUpdateArgs);
   });
});

describe("pVerifyUserEmail tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      MockDate.set("2025-09-27");
   });

   afterEach(() => {
      MockDate.reset();
   });

   test("user updated - test", async () => {
      const email = "test@email.com";
      const data = ptestData.pUserUpdateData();
      prismaMock.user.update.mockResolvedValue(data);

      await userRepository.pVerifyUserEmail(email);

      const expectedUpdateArgs: UserUpdateArgs = {
         where: { email },
         data: { emailVerified: new Date() },
      };

      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.update).toHaveBeenCalledWith(expectedUpdateArgs);
   });
});

describe("pGetEmailVerified tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("user null -  test", async () => {
      const email = "test@email.com";
      prismaMock.user.findFirst.mockResolvedValue(null);

      const result = await userRepository.pGetEmailVerified(email);

      const expectedFindFirstArgs: UserFindFirstArgs = {
         where: { email },
         select: { emailVerified: true },
      };

      expect(result).toBeNull();
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   test("emailVerified null - test", async () => {
      const user = ptestData.pUser();
      user.emailVerified = null;
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await userRepository.pGetEmailVerified(user.email);

      const expectedFindFirstArgs: UserFindFirstArgs = {
         where: { email: user.email },
         select: { emailVerified: true },
      };

      expect(result).toEqual(false);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   test("emailVerified defined - test", async () => {
      const user = ptestData.pUser();
      user.emailVerified = new Date();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await userRepository.pGetEmailVerified(user.email);

      const expectedFindFirstArgs: UserFindFirstArgs = {
         where: { email: user.email },
         select: { emailVerified: true },
      };

      expect(result).toEqual(true);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });
});

describe("pDeleteUser tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pDeleteUser - user deleted - test", async () => {
      const userId = "user-id-1";

      await userRepository.pDeleteUser(userId);

      const expectedSessionDeleteArgs: SessionDeleteManyArgs = {
         where: { userId },
      };
      const expectedAccountDeleteArgs: AccountDeleteManyArgs = {
         where: { userId },
      };

      const expectedUserDeleteArgs: UserDeleteArgs = {
         where: { id: userId },
      };

      expect(prismaMock.session.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.session.deleteMany).toHaveBeenCalledWith(
         expectedSessionDeleteArgs
      );
      expect(prismaMock.account.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.account.deleteMany).toHaveBeenCalledWith(
         expectedAccountDeleteArgs
      );
      expect(prismaMock.user.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.delete).toHaveBeenCalledWith(
         expectedUserDeleteArgs
      );
   });
});
