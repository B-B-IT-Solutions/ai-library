import {
   Subscription,
   SubscriptionHistory,
   SubscriptionPlan,
   User,
} from "@/generated/prisma/client";

export type UserWithSubscription = User & {
   subscription: (Subscription & { plan: SubscriptionPlan }) | null;
};

export type UserWithSubscriptionAndHistory = UserWithSubscription & {
   subscriptionHistory: SubscriptionHistory[];
};
