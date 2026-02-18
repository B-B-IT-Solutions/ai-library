import { Subscription, SubscriptionPlan } from "@/generated/prisma/client";

export type SubscriptionWithPlan = Subscription & {
   plan: SubscriptionPlan;
};
