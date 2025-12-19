import Stripe from "stripe";

import { STRIPE_SECRET_KEY } from "@/lib/constants";

export const stripeConfig: Stripe.StripeConfig = {
   apiVersion: "2025-12-15.clover",
   typescript: true,
};

export const stripe = new Stripe(STRIPE_SECRET_KEY, stripeConfig);
