jest.mock("@/data/services/stripe");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { StripeService } from "@/data/services/stripe";
import {
   DCreateSubscriptionCheckout,
   DSubscriptionCheckoutRequest,
   DSubscriptionCheckoutResult,
} from "@/data/types/domain/subscription";
import { ActionResult } from "@/data/types/utils";
import { requireUser } from "../auth-utils";

import {
   createOrderCheckoutSession,
   createSubscriptionCheckoutSession,
} from "./stripe.actions";

const sCreateOrderCheckoutSession =
   StripeService.prototype.createOrderCheckoutSession;
const sCreateSubscriptionCheckoutSession =
   StripeService.prototype.createSubscriptionCheckoutSession;

const sCreateOrderCheckoutSessionMock =
   sCreateOrderCheckoutSession as jest.MockedFunction<
      typeof sCreateOrderCheckoutSession
   >;

const sCreateSubscriptionCheckoutSessionMock =
   sCreateSubscriptionCheckoutSession as jest.MockedFunction<
      typeof sCreateSubscriptionCheckoutSession
   >;

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

describe("createOrderCheckoutSession tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("createOrderCheckoutSession - cart empty - test", async () => {
      const error = new Error("Your cart is empty.");
      sCreateOrderCheckoutSessionMock.mockRejectedValue(error);

      const result = await createOrderCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Your cart is empty.",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreateOrderCheckoutSessionMock).toHaveBeenCalledTimes(1);
   });

   it("createOrderCheckoutSession - create order error - test", async () => {
      const error = new Error("Failed to create order");
      sCreateOrderCheckoutSessionMock.mockRejectedValue(error);

      const result = await createOrderCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Failed to create order",
      };

      expect(result).toEqual(expectedResult);
      expect(sCreateOrderCheckoutSessionMock).toHaveBeenCalledTimes(1);
   });

   it("createOrderCheckoutSession - successful checkout - test", async () => {
      const checkoutSession = {
         sessionId: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };

      sCreateOrderCheckoutSessionMock.mockResolvedValue(checkoutSession);

      const result = await createOrderCheckoutSession();

      const expectedResult = {
         success: true,
         message: "Checkout session created",
         data: checkoutSession,
      };

      expect(result).toEqual(expectedResult);
      expect(sCreateOrderCheckoutSessionMock).toHaveBeenCalledTimes(1);
   });
});

describe("createSubscriptionCheckoutSession tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createSubscriptionCheckoutSession - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const params: DSubscriptionCheckoutRequest = {
         planId: "pland-id-1",
         billingInterval: "MONTHLY",
      };
      const result = await createSubscriptionCheckoutSession(params);

      const expectResult: ActionResult = {
         success: false,
         message: "Subscription checkout couldn't be initiated",
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateSubscriptionCheckoutSessionMock).not.toHaveBeenCalled();
   });

   it("createSubscriptionCheckoutSession - checkout error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sCreateSubscriptionCheckoutSessionMock.mockRejectedValue(
         "checkout error"
      );

      const params: DSubscriptionCheckoutRequest = {
         planId: "pland-id-1",
         billingInterval: "MONTHLY",
      };
      const result = await createSubscriptionCheckoutSession(params);

      const expectResult: ActionResult = {
         success: false,
         message: "Subscription checkout couldn't be initiated",
      };

      const expectedPayload: DCreateSubscriptionCheckout = {
         userId: user.id,
         userEmail: user.email as string,
         planId: params.planId,
         billingInterval: params.billingInterval,
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateSubscriptionCheckoutSessionMock).toHaveBeenCalledTimes(1);
      expect(sCreateSubscriptionCheckoutSessionMock).toHaveBeenCalledWith(
         expectedPayload
      );
   });

   it("createSubscriptionCheckoutSession - checkout created - test", async () => {
      const user = dtestData.dLoginUser();
      const data = dtestData.dSubscriptionCheckoutResult();
      requireUserMock.mockResolvedValue(user);

      sCreateSubscriptionCheckoutSessionMock.mockResolvedValue(data);

      const params: DSubscriptionCheckoutRequest = {
         planId: "pland-id-123",
         billingInterval: "YEARLY",
      };
      const result = await createSubscriptionCheckoutSession(params);

      const expectResult: ActionResult<DSubscriptionCheckoutResult> = {
         success: true,
         message: "Subscription checkout initiated successfully",
         data,
      };

      const expectedPayload: DCreateSubscriptionCheckout = {
         userId: user.id,
         userEmail: user.email as string,
         planId: params.planId,
         billingInterval: params.billingInterval,
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateSubscriptionCheckoutSessionMock).toHaveBeenCalledTimes(1);
      expect(sCreateSubscriptionCheckoutSessionMock).toHaveBeenCalledWith(
         expectedPayload
      );
   });
});
