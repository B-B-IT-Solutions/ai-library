import Stripe from "stripe";

import { stripeConfig } from "./stripe-server";

const expectedStripeConfig: Stripe.StripeConfig = {
   apiVersion: "2025-12-15.clover",
   typescript: true,
};

describe("stripeConfig tests", () => {
   beforeEach(() => {
      jest.resetModules();
      jest.clearAllMocks();
   });

   it("stripeConfig test", async () => {
      expect(stripeConfig).toEqual(expectedStripeConfig);
   });
});

describe("getStripe tests", () => {
   beforeEach(() => {
      jest.resetModules();
      jest.clearAllMocks();
   });

   describe("STRIPE_SECRET_KEY is undefined", () => {
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
         const { getStripe } = await import("./stripe-server");
         expect(() => getStripe()).toThrow(
            "STRIPE_SECRET_KEY is not set in environment variables"
         );
      });
   });

   describe("STRIPE_SECRET_KEY is empty string", () => {
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
         const { getStripe } = await import("./stripe-server");
         expect(() => getStripe()).toThrow(
            "STRIPE_SECRET_KEY is not set in environment variables"
         );
      });
   });

   describe("STRIPE STRIPE_SECRET_KEY is defined", () => {
      beforeEach(() => {
         jest.mock("@/lib/constants", () => ({
            STRIPE_WEBHOOK_SECRET: "mock-webhook-key-123",
            STRIPE_SECRET_KEY: "sk_test_mock_key_123",
         }));
      });

      afterEach(() => {
         jest.unmock("@/lib/constants");
      });

      it("stripe instance test", async () => {
         const { getStripe } = await import("./stripe-server");
         const stripe1 = getStripe();
         const stripe2 = getStripe();
         expect(stripe1).toBeDefined();
         expect(stripe2).toBeDefined();
         expect(stripe1).toBe(stripe1);
      });
   });
});

describe("getWebhookSecret tests", () => {
   beforeEach(() => {
      jest.resetModules();
      jest.clearAllMocks();
   });

   describe("STRIPE_WEBHOOK_SECRET is undefined", () => {
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
         const { getWebhookSecret } = await import("./stripe-server");
         expect(() => getWebhookSecret()).toThrow(
            "STRIPE_WEBHOOK_SECRET is not set in environment variables"
         );
      });
   });

   describe("STRIPE_WEBHOOK_SECRET is empty string", () => {
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
         const { getWebhookSecret } = await import("./stripe-server");
         expect(() => getWebhookSecret()).toThrow(
            "STRIPE_WEBHOOK_SECRET is not set in environment variables"
         );
      });
   });

   describe("STRIPE_WEBHOOK_SECRET is defined", () => {
      const mockStripeWeebhookSecret = "stripe-webhook-secret-1";
      beforeEach(() => {
         jest.mock("@/lib/constants", () => ({
            STRIPE_SECRET_KEY: "sk_test_mock_key_123",
            STRIPE_WEBHOOK_SECRET: mockStripeWeebhookSecret,
         }));
      });

      afterEach(() => {
         jest.unmock("@/lib/constants");
      });

      it("should throw an error when getWebhookSecret is called", async () => {
         const { getWebhookSecret } = await import("./stripe-server");
         const result = getWebhookSecret();
         expect(result).toEqual(mockStripeWeebhookSecret);
      });
   });
});
