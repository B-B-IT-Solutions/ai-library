import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { toDUser } from "@/data/services/user/user.mapper";
import { Prisma } from "@/generated/prisma/client";
import {
   AccountDeleteManyArgs,
   SessionDeleteManyArgs,
   UserCreateArgs,
   UserCreateInput,
   UserDeleteArgs,
   UserFindFirstArgs,
   UserUpdateArgs,
} from "@/generated/prisma/models";

import { UserRepository } from "./user";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const userRepository = new UserRepository(prismaMock);

describe("pGetUserById tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetUserById - user null -  test", async () => {
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

   test("pGetUserById - user retrieved - test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await userRepository.pGetUserById(user.id);

      const expectedResult = toDUser(user);

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

   test("pGetUserByEmail - user null -  test", async () => {
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

   test("pGetUserByEmail - user retrieved -  test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await userRepository.pGetUserByEmail(user.email);

      const expectedResult = toDUser(user);

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

   test("pGetUser - by userId - test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await userRepository.pGetUser({ userId: user.id });

      const expectedFindFirstArgs: Prisma.UserFindFirstArgs = {
         where: { id: user.id },
      };

      expect(result).toEqual(user);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   test("pGetUser - by email - test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await userRepository.pGetUser({ email: user.email });

      const expectedFindFirstArgs: Prisma.UserFindFirstArgs = {
         where: { email: user.email },
      };

      expect(result).toEqual(user);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   test("pGetUser - params undefined - test", async () => {
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

      const expectedResult = toDUser(newUser);

      const expectedInput: UserCreateInput = {
         name: createData.name,
         email: createData.email,
         password: createData.hashedPassword,
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
