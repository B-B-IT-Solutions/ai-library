jest.mock("@/data/services/subscription");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { SubscriptionService } from "@/data/services/subscription";

import {
   getSubscriptionPlans,
   getUserSubscription,
} from "./subscription.actions";

const sGetAvailablePlans = SubscriptionService.prototype.getAvailablePlans;
const sGetUserSubscription = SubscriptionService.prototype.getUserSubscription;

const sGetAvailablePlansMock = sGetAvailablePlans as jest.MockedFunction<
   typeof sGetAvailablePlans
>;
const sGetUserSubscriptionMock = sGetUserSubscription as jest.MockedFunction<
   typeof sGetUserSubscription
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
