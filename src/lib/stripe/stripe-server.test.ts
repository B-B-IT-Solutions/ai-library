import Stripe from "stripe";

const expectedStripeConfig: Stripe.StripeConfig = {
   apiVersion: "2025-12-15.clover",
   typescript: true,
};

describe("stripe-server", () => {
   beforeEach(() => {
      jest.resetModules();
      jest.clearAllMocks();
   });

   describe("when STRIPE_SECRET_KEY is set", () => {
      beforeEach(() => {
         jest.mock("@/lib/constants", () => ({
            STRIPE_SECRET_KEY: "sk_test_mock_key_123",
         }));
      });

      afterEach(() => {
         jest.unmock("@/lib/constants");
      });

      it("should export stripeConfig with correct configuration", async () => {
         const { stripeConfig } = await import("./stripe-server");
         expect(stripeConfig).toEqual(expectedStripeConfig);
      });

      it("should create Stripe instance with correct config", async () => {
         const { stripe, stripeConfig } = await import("./stripe-server");

         expect(stripe).toBeDefined();
         expect(stripe.getApiField("version")).toBe(stripeConfig.apiVersion);
         expect(stripeConfig.typescript).toBe(true);
      });
   });

   describe("when STRIPE_SECRET_KEY is not set", () => {
      beforeEach(() => {
         jest.mock("@/lib/constants", () => ({
            STRIPE_SECRET_KEY: undefined,
         }));
      });

      afterEach(() => {
         jest.unmock("@/lib/constants");
      });

      it("should throw an error on module import", async () => {
         const fn = async () => {
            await import("./stripe-server");
         };

         await expect(fn).rejects.toThrow(
            "STRIPE_SECRET_KEY is not set in environment variables"
         );
      });
   });

   describe("when STRIPE_SECRET_KEY is empty string", () => {
      beforeEach(() => {
         jest.mock("@/lib/constants", () => ({
            STRIPE_SECRET_KEY: "",
         }));
      });

      afterEach(() => {
         jest.unmock("@/lib/constants");
      });

      it("should throw an error on module import", async () => {
         const fn = async () => {
            await import("./stripe-server");
         };

         await expect(fn).rejects.toThrow(
            "STRIPE_SECRET_KEY is not set in environment variables"
         );
      });
   });
});
