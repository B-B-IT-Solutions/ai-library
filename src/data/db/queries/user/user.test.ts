import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/db/prisma";
import { Prisma } from "@/generated/prisma/client";

import { createUser, getUser } from "./user";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("getUser tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("getUser - user created - test", async () => {
      const user = ptestData.pUser();
      prismaMock.user.findFirst.mockResolvedValue(user);

      const result = await getUser(user.id);

      const expectedFindFirstArgs: Prisma.UserFindFirstArgs = {
         where: { id: user.id },
      };

      expect(result).toEqual(user);
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
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
