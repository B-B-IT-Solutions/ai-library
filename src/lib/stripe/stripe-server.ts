import Stripe from "stripe";

import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "@/lib/constants";

let _stripe: Stripe | null = null;

export const stripeConfig: Stripe.StripeConfig = {
   apiVersion: "2026-02-25.clover",
   typescript: true,
};

export const getStripe = (): Stripe => {
   if (!_stripe) {
      if (!STRIPE_SECRET_KEY) {
         throw new Error(
            "STRIPE_SECRET_KEY is not set in environment variables"
         );
      }
      _stripe = new Stripe(STRIPE_SECRET_KEY, stripeConfig);
   }
   return _stripe;
};

export const getWebhookSecret = (): string => {
   if (!STRIPE_WEBHOOK_SECRET) {
      throw new Error(
         "STRIPE_WEBHOOK_SECRET is not set in environment variables"
      );
   }
   return STRIPE_WEBHOOK_SECRET;
};
