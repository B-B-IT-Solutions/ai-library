jest.mock("@/data/services/stripe");

import { StripeService } from "@/data/services/stripe";

import { createCheckoutSession } from "./stripe.actions";

const sCreateCheckoutSession = StripeService.prototype.createCheckoutSession;

const sCreateCheckoutSessionMock =
   sCreateCheckoutSession as jest.MockedFunction<typeof sCreateCheckoutSession>;

describe("createCheckoutSession tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("createCheckoutSession - cart empty - test", async () => {
      const error = new Error("Your cart is empty.");
      sCreateCheckoutSessionMock.mockRejectedValue(error);

      const result = await createCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Your cart is empty.",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreateCheckoutSessionMock).toHaveBeenCalledTimes(1);
   });

   it("createCheckoutSession - create order error - test", async () => {
      const error = new Error("Failed to create order");
      sCreateCheckoutSessionMock.mockRejectedValue(error);

      const result = await createCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Failed to create order",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreateCheckoutSessionMock).toHaveBeenCalledTimes(1);
   });

   it("createCheckoutSession - successful checkout - test", async () => {
      const checkoutSession = {
         sessionId: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };

      sCreateCheckoutSessionMock.mockResolvedValue(checkoutSession);

      const result = await createCheckoutSession();

      const expectedResult = {
         success: true,
         message: "Checkout session created",
         data: checkoutSession,
      };

      expect(result).toEqual(expectedResult);
      expect(sCreateCheckoutSessionMock).toHaveBeenCalledTimes(1);
   });
});
