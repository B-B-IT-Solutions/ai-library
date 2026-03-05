import Stripe from "stripe";

import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "@/lib/constants";

if (!STRIPE_WEBHOOK_SECRET) {
   throw new Error("STRIPE_WEBHOOK_SECRET is not set in environment variables");
}

if (!STRIPE_SECRET_KEY) {
   throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripeConfig: Stripe.StripeConfig = {
   apiVersion: "2025-12-15.clover",
   typescript: true,
};

export const stripe = new Stripe(STRIPE_SECRET_KEY, stripeConfig);
