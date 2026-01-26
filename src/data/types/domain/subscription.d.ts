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
   features: DSubscriptionPlanFeatures;
   isActive: boolean;
   createdAt: string;
   updatedAt: string;
};

export type DSubscriptionPlanFeatures = {
   maxPrompts: number;
   maxLibraryItems: number;
   canAccessMarketplace: boolean;
   canPurchaseItems: boolean;
   canExportPrompts: boolean;
   canUseAdvancedFeatures: boolean;
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

export type DSubscriptionCheckoutRequest = {
   planId: string;
   billingInterval: DBillingInterval;
};

export type DCreateSubscriptionCheckout = {
   userId: string;
   userEmail: string;
   planId: string;
   billingInterval: DBillingInterval;
   successUrl?: string;
   cancelUrl?: string;
};

export type DSubscriptionCreate = {
   userId: string;
   planId: string;
   billingInterval: DBillingInterval;
   tier: DSubscriptionTier;
   stripeCustomerId: string;
   stripeCheckoutSessionId: string;
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
