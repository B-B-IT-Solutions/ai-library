import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import { UserUpdateArgs } from "@/generated/prisma/models";

import {
   createUser,
   getUser,
   getUserByEmail,
   getUserById,
   updateUser,
} from "./user";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("getUser tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("getUserById test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await getUserById(user.id);

      const expectedFindFirstArgs: Prisma.UserFindFirstArgs = {
         where: { id: user.id },
      };

      expect(result).toEqual(user);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   test("getUserByEmail test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await getUserByEmail(user.email);

      const expectedFindFirstArgs: Prisma.UserFindFirstArgs = {
         where: { email: user.email },
      };

      expect(result).toEqual(user);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   test("getUser - by userId - test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await getUser({ userId: user.id });

      const expectedFindFirstArgs: Prisma.UserFindFirstArgs = {
         where: { id: user.id },
      };

      expect(result).toEqual(user);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   test("getUser - by email - test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await getUser({ email: user.email });

      const expectedFindFirstArgs: Prisma.UserFindFirstArgs = {
         where: { email: user.email },
      };

      expect(result).toEqual(user);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });

   test("getUser - params undefined - test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await getUser({});

      expect(result).toBeNull();
      expect(prismaMock.user.findFirst).not.toHaveBeenCalled();
   });
});

describe("createUser tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("createUser - user created - test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.create.mockResolvedValue(user);
      const result = await createUser(user);

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

describe("updateUser tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("updateUser - user updated - test", async () => {
      const userId = "user-id-1";
      const data = ptestData.pUserUpdateData();
      prismaMock.user.update.mockResolvedValue(data);

      const result = await updateUser(userId, data);

      const expectedUpdateArgs: UserUpdateArgs = {
         where: { id: userId },
         data: data,
      };

      expect(result).toEqual(data);
      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.update).toHaveBeenCalledWith(expectedUpdateArgs);
   });
});
