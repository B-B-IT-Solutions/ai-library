import Stripe from "stripe";

import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "@/lib/constants";

let _stripe: Stripe | null = null;

export const stripeConfig: Stripe.StripeConfig = {
   apiVersion: "2025-12-15.clover",
   typescript: true,
};

export const getWebhookSecret = (): string => {
   if (!STRIPE_WEBHOOK_SECRET) {
      throw new Error(
         "STRIPE_WEBHOOK_SECRET is not set in environment variables"
      );
   }
   return STRIPE_WEBHOOK_SECRET;
};

export const stripe: Stripe = new Proxy({} as Stripe, {
   get(_target, prop) {
      const instance = getStripeInstance();
      const value = Reflect.get(instance, prop, instance);
      if (typeof value === "function") {
         return value.bind(instance);
      }
      return value;
   },
});

const getStripeInstance = (): Stripe => {
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
