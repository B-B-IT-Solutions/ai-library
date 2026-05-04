import { ptestData } from "@tests";

import { DUserInternal } from "@/data/types/domain/user";
import { User } from "@/generated/prisma/client";

import { toDUserInternal } from "./user.mapper";

export const toDUserInternatTest = (pUser: User): DUserInternal => {
   return {
      id: pUser.id,
      name: pUser.name,
      email: pUser.email,
      role: pUser.role,
      password: pUser.password,
      stripeCustomerId: pUser.stripeCustomerId,
      emailVerified: pUser.emailVerified?.toISOString() ?? null,
      updatedAt: pUser.updatedAt.toISOString(),
      createdAt: pUser.createdAt.toISOString(),
   };
};

describe("toDUserInternal tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toDUserInternal test", async () => {
      const user = ptestData.pUser();
      const result = toDUserInternal(user);
      const expectedResult = toDUserInternatTest(user);
      expect(result).toEqual(expectedResult);
   });

   it("toDUserInternal - emailVerified null - test", async () => {
      const user = ptestData.pUser();
      user.emailVerified = null;

      const result = toDUserInternal(user);
      const expectedResult = toDUserInternatTest(user);
      expect(result).toEqual(expectedResult);
   });
});
