import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { Prisma } from "@/generated/prisma/client";
import { UserUpdateArgs } from "@/generated/prisma/models";

import { UserRepository } from "./user";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const userRepository = new UserRepository(prismaMock);

describe("pGetUser tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetUserById test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await userRepository.pGetUserById(user.id);

      const expectedFindFirstArgs: Prisma.UserFindFirstArgs = {
         where: { id: user.id },
      };

      expect(result).toEqual(user);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   test("pGetUserByEmail test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await userRepository.pGetUserByEmail(user.email);

      const expectedFindFirstArgs: Prisma.UserFindFirstArgs = {
         where: { email: user.email },
      };

      expect(result).toEqual(user);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
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
      const user = ptestData.pUser();
      prismaMock.user.create.mockResolvedValue(user);
      const result = await userRepository.pCreateUser(user);

      const expectedCreateArgs: Prisma.UserCreateArgs = {
         data: {
            name: user.name,
            email: user.email,
            password: user.password,
         },
      };

      expect(result).toEqual(user);
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
