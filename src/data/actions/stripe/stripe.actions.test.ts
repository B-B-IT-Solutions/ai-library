jest.mock("@/data/services/stripe");

import { StripeService } from "@/data/services/stripe";

import { createOrderCheckoutSession } from "./stripe.actions";

const sCreateCheckoutSession =
   StripeService.prototype.createOrderCheckoutSession;

const sCreateCheckoutSessionMock =
   sCreateCheckoutSession as jest.MockedFunction<typeof sCreateCheckoutSession>;

describe("createOrderCheckoutSession tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("createOrderCheckoutSession - cart empty - test", async () => {
      const error = new Error("Your cart is empty.");
      sCreateCheckoutSessionMock.mockRejectedValue(error);

      const result = await createOrderCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Your cart is empty.",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreateCheckoutSessionMock).toHaveBeenCalledTimes(1);
   });

   it("createOrderCheckoutSession - create order error - test", async () => {
      const error = new Error("Failed to create order");
      sCreateCheckoutSessionMock.mockRejectedValue(error);

      const result = await createOrderCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Failed to create order",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreateCheckoutSessionMock).toHaveBeenCalledTimes(1);
   });

   it("createOrderCheckoutSession - successful checkout - test", async () => {
      const checkoutSession = {
         sessionId: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };

      sCreateCheckoutSessionMock.mockResolvedValue(checkoutSession);

      const result = await createOrderCheckoutSession();

      const expectedResult = {
         success: true,
         message: "Checkout session created",
         data: checkoutSession,
      };

      expect(result).toEqual(expectedResult);
      expect(sCreateCheckoutSessionMock).toHaveBeenCalledTimes(1);
   });
});
