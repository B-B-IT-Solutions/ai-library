import Stripe from "stripe";

import { stripe, stripeConfig } from "./stripe-server";

const expectedStripeConfig: Stripe.StripeConfig = {
   apiVersion: "2025-12-15.clover",
   typescript: true,
};

describe("stripe-server tests", () => {
   it("stripeConfig test", async () => {
      expect(stripeConfig).toEqual(expectedStripeConfig);
   });

   it("stripe instance test", async () => {
      expect(stripe).toBeDefined();
      expect(stripe.getApiField("version")).toBe(stripeConfig.apiVersion);
      expect(stripeConfig.typescript).toBe(true);
   });
});
