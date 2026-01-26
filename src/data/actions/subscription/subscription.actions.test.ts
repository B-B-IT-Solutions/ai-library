jest.mock("@/data/services/subscription");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { SubscriptionService } from "@/data/services/subscription";
import { ActionResult } from "@/data/types/utils";

import {
   cancelSubscription,
   getSubscriptionPlans,
   getUserSubscription,
   reactivateSubscription,
} from "./subscription.actions";

const sGetAvailablePlans = SubscriptionService.prototype.getAvailablePlans;
const sGetUserSubscription = SubscriptionService.prototype.getUserSubscription;
const sCancelSubscription = SubscriptionService.prototype.cancelSubscription;
const sReactivateSubscription =
   SubscriptionService.prototype.reactivateSubscription;

const sGetAvailablePlansMock = sGetAvailablePlans as jest.MockedFunction<
   typeof sGetAvailablePlans
>;
const sGetUserSubscriptionMock = sGetUserSubscription as jest.MockedFunction<
   typeof sGetUserSubscription
>;
const sCancelSubscriptionMock = sCancelSubscription as jest.MockedFunction<
   typeof sCancelSubscription
>;
const sReactivateSubscriptionMock =
   sReactivateSubscription as jest.MockedFunction<
      typeof sReactivateSubscription
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
