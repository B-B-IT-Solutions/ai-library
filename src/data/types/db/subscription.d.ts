import { SubscriptionStatus } from "@/generated/prisma/enums";

export type SubscriptionWithPlan = Subscription & {
   plan: SubscriptionPlan;
};

export type SubscriptionUpdate = {
   status?: SubscriptionStatus;
   stripeSubscriptionId?: string;
   stripeCustomerId?: string;
   stripeCheckoutSessionId?: string;
   currentPeriodStart?: Date;
   currentPeriodEnd?: Date;
   cancelAtPeriodEnd?: boolean;
   canceledAt?: Date | null;
};

export type SubscriptionHistoryCreate = {
   userId: string;
   eventType: string;
   fromTier?: SubscriptionTier;
   toTier?: SubscriptionTier;
   fromStatus?: SubscriptionStatus;
   toStatus?: SubscriptionStatus;
   stripeEventId?: string;
   metadata?: any;
};
