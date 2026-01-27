import Stripe from "stripe";

import { DCartItem } from "@/data/types/domain/cart";
import { SubscriptionStatus } from "@/generated/prisma/enums";

const subscriptionStatusMap: Record<
   Stripe.Subscription.Status,
   SubscriptionStatus
> = {
   active: "ACTIVE",
   canceled: "CANCELED",
   incomplete: "INCOMPLETE",
   incomplete_expired: "INCOMPLETE",
   past_due: "PAST_DUE",
   unpaid: "UNPAID",
   trialing: "TRIALING",
   paused: "PAUSED",
};

export const toStripePriceUnit = (item: DCartItem) => {
   return Math.round(item.productPrice * 100); // Convert to cents
};

export const mapStripeStatus = (stripeStatus: Stripe.Subscription.Status) => {
   return subscriptionStatusMap[stripeStatus] || "INCOMPLETE";
};
