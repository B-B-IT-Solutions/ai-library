import { map } from "es-toolkit/compat";

import { toDSubscription } from "@/data/repositories/subscription/subscription.mapper";
import {
   UserWithSubscription,
   UserWithSubscriptionAndHistory,
} from "@/data/types/db/admin/user";
import {
   DAdminSubscriptionHistoryItem,
   DAdminUserDetail,
   DAdminUserListItem,
} from "@/data/types/domain/admin/admin";
import { SubscriptionHistory } from "@/generated/prisma/client";

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
   user: UserWithSubscriptionAndHistory
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
   subscription: user.subscription ? toDSubscription(user.subscription) : null,
   subscriptionHistory: map(
      user.subscriptionHistory,
      toDAdminSubscriptionHistoryItem
   ),
});

const toDAdminSubscriptionHistoryItem = (
   h: SubscriptionHistory
): DAdminSubscriptionHistoryItem => ({
   id: h.id,
   eventType: h.eventType,
   fromTier: h.fromTier ?? null,
   toTier: h.toTier ?? null,
   fromStatus: h.fromStatus ?? null,
   toStatus: h.toStatus ?? null,
   stripeEventId: h.stripeEventId ?? null,
   createdAt: h.createdAt.toISOString(),
});
