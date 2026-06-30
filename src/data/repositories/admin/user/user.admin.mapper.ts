import { map } from "es-toolkit/compat";

import { UserWithSubscription } from "@/data/types/db/admin/user";
import { DAdminUser } from "@/data/types/domain/admin/user";

export const toDAdminUsers = (users: UserWithSubscription[]): DAdminUser[] => {
   return map(users, toDAdminUser);
};

export const toDAdminUser = (user: UserWithSubscription): DAdminUser => {
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
