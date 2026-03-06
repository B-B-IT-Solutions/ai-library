import Stripe from "stripe";

import { stripe, stripeConfig, getWebhookSecret } from "./stripe-server";

const expectedStripeConfig: Stripe.StripeConfig = {
   apiVersion: "2025-12-15.clover",
   typescript: true,
};

describe("stripe-server", () => {
   beforeEach(() => {
      jest.resetModules();
      jest.clearAllMocks();
   });

   describe("when STRIPE VARIABlES are set", () => {
      beforeEach(() => {
         jest.mock("@/lib/constants", () => ({
            STRIPE_WEBHOOK_SECRET: "mock-webhook-key-123",
            STRIPE_SECRET_KEY: "sk_test_mock_key_123",
         }));
      });

      afterEach(() => {
         jest.unmock("@/lib/constants");
      });

      it("stripeConfig test", async () => {
         expect(stripeConfig).toEqual(expectedStripeConfig);
      });

      it("stripe instance test", async () => {
         expect(stripe).toBeDefined();
         expect(stripe.getApiField("version")).toBe(stripeConfig.apiVersion);
         expect(stripeConfig.typescript).toBe(true);
      });
   });

   describe("when STRIPE_SECRET_KEY is not set", () => {
      beforeEach(() => {
         jest.mock("@/lib/constants", () => ({
            STRIPE_WEBHOOK_SECRET: "mock-webhook-key-123",
            STRIPE_SECRET_KEY: undefined,
         }));
      });

      afterEach(() => {
         jest.unmock("@/lib/constants");
      });

      it("should throw an error when stripe client is first accessed", async () => {
         const { stripe: lazyStripe } = await import("./stripe-server");
         expect(() => lazyStripe.getApiField("version")).toThrow(
            "STRIPE_SECRET_KEY is not set in environment variables"
         );
      });
   });

   describe("when STRIPE_SECRET_KEY is empty string", () => {
      beforeEach(() => {
         jest.mock("@/lib/constants", () => ({
            STRIPE_WEBHOOK_SECRET: "mock-webhook-key-123",
            STRIPE_SECRET_KEY: "",
         }));
      });

      afterEach(() => {
         jest.unmock("@/lib/constants");
      });

      it("should throw an error when stripe client is first accessed", async () => {
         const { stripe: lazyStripe } = await import("./stripe-server");
         expect(() => lazyStripe.getApiField("version")).toThrow(
            "STRIPE_SECRET_KEY is not set in environment variables"
         );
      });
   });

   describe("when STRIPE_WEBHOOK_SECRET is not set", () => {
      beforeEach(() => {
         jest.mock("@/lib/constants", () => ({
            STRIPE_SECRET_KEY: "sk_test_mock_key_123",
            STRIPE_WEBHOOK_SECRET: undefined,
         }));
      });

      afterEach(() => {
         jest.unmock("@/lib/constants");
      });

      it("should throw an error when getWebhookSecret is called", async () => {
         const { getWebhookSecret: lazyGetWebhookSecret } = await import("./stripe-server");
         expect(() => lazyGetWebhookSecret()).toThrow(
            "STRIPE_WEBHOOK_SECRET is not set in environment variables"
         );
      });
   });

   describe("when STRIPE_WEBHOOK_SECRET is empty string", () => {
      beforeEach(() => {
         jest.mock("@/lib/constants", () => ({
            STRIPE_SECRET_KEY: "sk_test_mock_key_123",
            STRIPE_WEBHOOK_SECRET: "",
         }));
      });

      afterEach(() => {
         jest.unmock("@/lib/constants");
      });

      it("should throw an error when getWebhookSecret is called", async () => {
         const { getWebhookSecret: lazyGetWebhookSecret } = await import("./stripe-server");
         expect(() => lazyGetWebhookSecret()).toThrow(
            "STRIPE_WEBHOOK_SECRET is not set in environment variables"
         );
      });
   });
});
