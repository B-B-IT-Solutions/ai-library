export type DSubscriptionTier = "FREE" | "BASIC" | "PRO";

export type DBillingInterval = "MONTHLY" | "YEARLY";

export type DSubscriptionStatus =
  | "ACTIVE"
  | "CANCELED"
  | "INCOMPLETE"
  | "PAST_DUE"
  | "UNPAID"
  | "TRIALING"
  | "PAUSED";

export type DSubscriptionPlan = {
  id: string;
  tier: DSubscriptionTier;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
  stripeProductId: string | null;
  features: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DSubscription = {
  id: string;
  userId: string;
  planId: string;
  status: DSubscriptionStatus;
  billingInterval: DBillingInterval;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  stripeCheckoutSessionId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
  plan: DSubscriptionPlan;
};

export type DCreateSubscriptionCheckout = {
  planId: string;
  billingInterval: DBillingInterval;
  successUrl: string;
  cancelUrl: string;
};

export type DSubscriptionUpdate = {
  status?: DSubscriptionStatus;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripeCheckoutSessionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: Date | null;
};

export type DSubscriptionHistoryCreate = {
  userId: string;
  eventType: string;
  fromTier?: DSubscriptionTier;
  toTier?: DSubscriptionTier;
  fromStatus?: DSubscriptionStatus;
  toStatus?: DSubscriptionStatus;
  stripeEventId?: string;
  metadata?: Record<string, any>;
};
