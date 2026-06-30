import { aptestData } from "@tests";
import { map } from "es-toolkit/compat";

import { UserWithSubscription } from "@/data/types/db/admin/user";
import { DAdminUser } from "@/data/types/domain/admin/user";

import { toDAdminUser, toDAdminUsers } from "./user.admin.mapper";

export const toDAdminUsersInternal = (
   users: UserWithSubscription[]
): DAdminUser[] => {
   return map(users, toDAdminUserInternal);
};

export const toDAdminUserInternal = (
   user: UserWithSubscription
): DAdminUser => {
   return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified?.toISOString(),
      subscriptionTier: user.subscription?.plan?.tier,
      subscriptionStatus: user.subscription?.status,
      stripeCustomerId: user.stripeCustomerId,
      trialEndsAt: user.trialEndsAt?.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      createdAt: user.createdAt.toISOString(),
   };
};

describe("user mappers tests", () => {
   it("toDAdminUsers test", async () => {
      const users = aptestData.pUsersWithSubscription();
      const result = toDAdminUsersInternal(users);
      const expectedResult = toDAdminUsers(users);
      expect(result).toEqual(expectedResult);
   });

   it("toDAdminUser test", async () => {
      const user = aptestData.pUserWithSubscription();
      const result = toDAdminUser(user);
      const expectedResult = toDAdminUserInternal(user);
      expect(result).toEqual(expectedResult);
   });

   it("toDAdminUser - values null test", async () => {
      const user = aptestData.pUserWithSubscription();
      user.subscription = null;
      const result = toDAdminUser(user);
      const expectedResult = toDAdminUserInternal(user);
      expect(result).toEqual(expectedResult);
   });
});
