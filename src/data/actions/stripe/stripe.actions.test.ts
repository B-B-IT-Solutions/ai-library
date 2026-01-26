jest.mock("@/data/services/stripe");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { StripeService } from "@/data/services/stripe";
import {
   DStripeBillingPortalSessionResponse,
   DStripeCheckoutResponse,
} from "@/data/types/domain/stripe";
import {
   DCreateSubscriptionCheckout,
   DSubscriptionCheckoutRequest,
} from "@/data/types/domain/subscription";
import { ActionResult } from "@/data/types/utils";
import { requireUser } from "../auth-utils";

import {
   cancelSubscription,
   createCustomerPortal,
   createOrderCheckoutSession,
   createSubscriptionCheckoutSession,
   reactivateSubscription,
} from "./stripe.actions";

const sCreateOrderCheckoutSession =
   StripeService.prototype.createOrderCheckoutSession;
const sCreateSubscriptionCheckoutSession =
   StripeService.prototype.createSubscriptionCheckoutSession;
const sCancelSubscription = StripeService.prototype.cancelSubscription;
const sReactivateSubscription = StripeService.prototype.reactivateSubscription;
const sCreatePortalSession = StripeService.prototype.createPortalSession;

const sCreateOrderCheckoutSessionMock =
   sCreateOrderCheckoutSession as jest.MockedFunction<
      typeof sCreateOrderCheckoutSession
   >;

const sCreateSubscriptionCheckoutSessionMock =
   sCreateSubscriptionCheckoutSession as jest.MockedFunction<
      typeof sCreateSubscriptionCheckoutSession
   >;

const sCancelSubscriptionMock = sCancelSubscription as jest.MockedFunction<
   typeof sCancelSubscription
>;
const sReactivateSubscriptionMock =
   sReactivateSubscription as jest.MockedFunction<
      typeof sReactivateSubscription
   >;
const sCreatePortalSessionMock = sCreatePortalSession as jest.MockedFunction<
   typeof sCreatePortalSession
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
      const data = dtestData.dStripeCheckoutResponse();
      requireUserMock.mockResolvedValue(user);

      sCreateSubscriptionCheckoutSessionMock.mockResolvedValue(data);

      const params: DSubscriptionCheckoutRequest = {
         planId: "pland-id-123",
         billingInterval: "YEARLY",
      };
      const result = await createSubscriptionCheckoutSession(params);

      const expectResult: ActionResult<DStripeCheckoutResponse> = {
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

describe("cancelSubscription tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("cancelSubscription - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await cancelSubscription();

      const expectResult: ActionResult = {
         success: false,
         message: "Subscription couldn't be cancelled",
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCancelSubscriptionMock).not.toHaveBeenCalled();
   });

   it("cancelSubscription - stripe cancelation error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sCancelSubscriptionMock.mockRejectedValue("cancellation error");

      const result = await cancelSubscription();

      const expectResult: ActionResult = {
         success: false,
         message: "Subscription couldn't be cancelled",
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCancelSubscriptionMock).toHaveBeenCalledTimes(1);
      expect(sCancelSubscriptionMock).toHaveBeenCalledWith(user.id);
   });

   it("cancelSubscription - stripe cancelation succeded - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sCancelSubscriptionMock.mockResolvedValue();

      const result = await cancelSubscription();

      const expectResult: ActionResult = {
         success: true,
         message: "Subscription cancelled successfully",
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCancelSubscriptionMock).toHaveBeenCalledTimes(1);
      expect(sCancelSubscriptionMock).toHaveBeenCalledWith(user.id);
   });
});

describe("reactivateSubscription tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("reactivateSubscription - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await reactivateSubscription();

      const expectResult: ActionResult = {
         success: false,
         message: "Subscription couldn't be reactivated",
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sReactivateSubscriptionMock).not.toHaveBeenCalled();
   });

   it("reactivateSubscription - stripe reactivation error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sReactivateSubscriptionMock.mockRejectedValue("reactivation error");

      const result = await reactivateSubscription();

      const expectResult: ActionResult = {
         success: false,
         message: "Subscription couldn't be reactivated",
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sReactivateSubscriptionMock).toHaveBeenCalledTimes(1);
      expect(sReactivateSubscriptionMock).toHaveBeenCalledWith(user.id);
   });

   it("reactivateSubscription - stripe reactivation succeded - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sReactivateSubscriptionMock.mockResolvedValue();

      const result = await reactivateSubscription();

      const expectResult: ActionResult = {
         success: true,
         message: "Subscription reactivated successfully",
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sReactivateSubscriptionMock).toHaveBeenCalledTimes(1);
      expect(sReactivateSubscriptionMock).toHaveBeenCalledWith(user.id);
   });
});

describe("createCustomerPortal tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createCustomerPortal - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await createCustomerPortal();

      const expectResult: ActionResult = {
         success: false,
         message: "Billing Portal session couldn't be established",
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreatePortalSessionMock).not.toHaveBeenCalled();
   });

   it("createCustomerPortal - portal session creation error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sCreatePortalSessionMock.mockRejectedValue("portal session error");

      const result = await createCustomerPortal();

      const expectResult: ActionResult = {
         success: false,
         message: "Billing Portal session couldn't be established",
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreatePortalSessionMock).toHaveBeenCalledTimes(1);
      expect(sCreatePortalSessionMock).toHaveBeenCalledWith(user.id);
   });

   it("createCustomerPortal - portal session created successfully - test", async () => {
      const user = dtestData.dLoginUser();
      const portalSession = dtestData.dStripeBillingPortalSessionResponse();
      requireUserMock.mockResolvedValue(user);
      sCreatePortalSessionMock.mockResolvedValue(portalSession);

      const result = await createCustomerPortal();

      const expectResult: ActionResult<DStripeBillingPortalSessionResponse> = {
         success: true,
         message: "Billing Portal session created established",
         data: portalSession,
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreatePortalSessionMock).toHaveBeenCalledTimes(1);
      expect(sCreatePortalSessionMock).toHaveBeenCalledWith(user.id);
   });
});
