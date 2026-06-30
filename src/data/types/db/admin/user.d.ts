import {
   Subscription,
   SubscriptionPlan,
   User,
} from "@/generated/prisma/client";

export type UserWithSubscription = User & {
   subscription: (Subscription & { plan: SubscriptionPlan }) | null;
};
