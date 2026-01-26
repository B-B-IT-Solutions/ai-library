jest.mock("@/data/services/subscription");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { SubscriptionService } from "@/data/services/subscription";
import {
   DCreateSubscriptionCheckout,
   DSubscriptionCheckoutRequest,
   DSubscriptionCheckoutResult,
} from "@/data/types/domain/subscription";
import { ActionResult } from "@/data/types/utils";

import {
   cancelSubscription,
   createSubscriptionCheckout,
   getSubscriptionPlans,
   getUserSubscription,
} from "./subscription.actions";

const sGetAvailablePlans = SubscriptionService.prototype.getAvailablePlans;
const sGetUserSubscription = SubscriptionService.prototype.getUserSubscription;
const sCreateCheckoutSession =
   SubscriptionService.prototype.createCheckoutSession;
const sCancelSubscription = SubscriptionService.prototype.cancelSubscription;

const sGetAvailablePlansMock = sGetAvailablePlans as jest.MockedFunction<
   typeof sGetAvailablePlans
>;
const sGetUserSubscriptionMock = sGetUserSubscription as jest.MockedFunction<
   typeof sGetUserSubscription
>;
const sCreateCheckoutSessionMock =
   sCreateCheckoutSession as jest.MockedFunction<typeof sCreateCheckoutSession>;
const sCancelSubscriptionMock = sCancelSubscription as jest.MockedFunction<
   typeof sCancelSubscription
>;

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

describe("getSubscriptionPlans tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getSubscriptionPlans - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const fn = () => getSubscriptionPlans();

      await expect(fn).rejects.toThrow(error);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetAvailablePlansMock).not.toHaveBeenCalled();
   });

   it("getSubscriptionPlans - plans retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const plans = dtestData.dSubscriptionPlans();

      requireUserMock.mockResolvedValue(user);
      sGetAvailablePlansMock.mockResolvedValue(plans);

      const result = await getSubscriptionPlans();

      expect(result).toEqual(plans);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetAvailablePlansMock).toHaveBeenCalledTimes(1);
   });
});

describe("getUserSubscription tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getUserSubscription - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const fn = () => getUserSubscription();

      await expect(fn).rejects.toThrow(error);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetUserSubscriptionMock).not.toHaveBeenCalled();
   });

   it("getUserSubscription - subscription retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const subscription = dtestData.dSubscription();

      requireUserMock.mockResolvedValue(user);
      sGetUserSubscriptionMock.mockResolvedValue(subscription);

      const result = await getUserSubscription();

      expect(result).toEqual(subscription);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetUserSubscriptionMock).toHaveBeenCalledTimes(1);
      expect(sGetUserSubscriptionMock).toHaveBeenCalledWith(user.id);
   });
});

describe("createSubscriptionCheckout tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createSubscriptionCheckout - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const params: DSubscriptionCheckoutRequest = {
         planId: "pland-id-1",
         billingInterval: "MONTHLY",
      };
      const result = await createSubscriptionCheckout(params);

      const expectResult: ActionResult = {
         success: false,
         message: "Subscription checkout couldn't be initiated",
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCreateCheckoutSessionMock).not.toHaveBeenCalled();
   });

   it("createSubscriptionCheckout - stripe checkout error - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      sCreateCheckoutSessionMock.mockRejectedValue("checkout error");

      const params: DSubscriptionCheckoutRequest = {
         planId: "pland-id-1",
         billingInterval: "MONTHLY",
      };
      const result = await createSubscriptionCheckout(params);

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
      expect(sCreateCheckoutSessionMock).toHaveBeenCalledTimes(1);
      expect(sCreateCheckoutSessionMock).toHaveBeenCalledWith(expectedPayload);
   });

   it("createSubscriptionCheckout - stripe checkout created - test", async () => {
      const user = dtestData.dLoginUser();
      const data = dtestData.dSubscriptionCheckoutResult();
      requireUserMock.mockResolvedValue(user);

      sCreateCheckoutSessionMock.mockResolvedValue(data);

      const params: DSubscriptionCheckoutRequest = {
         planId: "pland-id-123",
         billingInterval: "YEARLY",
      };
      const result = await createSubscriptionCheckout(params);

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
      expect(sCreateCheckoutSessionMock).toHaveBeenCalledTimes(1);
      expect(sCreateCheckoutSessionMock).toHaveBeenCalledWith(expectedPayload);
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

      const expectResult: ActionResult<DSubscriptionCheckoutResult> = {
         success: true,
         message: "Subscription cancelled successfully",
      };

      expect(result).toEqual(expectResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sCancelSubscriptionMock).toHaveBeenCalledTimes(1);
      expect(sCancelSubscriptionMock).toHaveBeenCalledWith(user.id);
   });
});
