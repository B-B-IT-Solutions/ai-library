import { map } from "es-toolkit/compat";

import { UserWithSubscription } from "@/data/types/db/admin/user";
import {
   DAdminUserDetail,
   DAdminUserListItem,
} from "@/data/types/domain/admin/admin";

export const toDAdminUserListItem = (
   user: UserWithSubscription
): DAdminUserListItem => ({
   id: user.id,
   name: user.name ?? "",
   email: user.email ?? "",
   role: user.role,
   emailVerified: user.emailVerified?.toISOString() ?? null,
   subscriptionTier: user.subscription?.plan?.tier ?? null,
   subscriptionStatus: user.subscription?.status ?? null,
   createdAt: user.createdAt.toISOString(),
});

export const toDAdminUserListItems = (
   users: UserWithSubscription[]
): DAdminUserListItem[] => map(users, toDAdminUserListItem);

export const toDAdminUserDetail = (
   user: UserWithSubscription
): DAdminUserDetail => ({
   id: user.id,
   name: user.name ?? "",
   email: user.email ?? "",
   role: user.role,
   emailVerified: user.emailVerified?.toISOString() ?? null,
   subscriptionTier: user.subscription?.plan?.tier ?? null,
   subscriptionStatus: user.subscription?.status ?? null,
   stripeCustomerId: user.stripeCustomerId ?? null,
   trialEndsAt: user.trialEndsAt?.toISOString() ?? null,
   createdAt: user.createdAt.toISOString(),
   updatedAt: user.updatedAt.toISOString(),
});
