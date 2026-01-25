jest.mock("@/data/services/subscription");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";

import { requireUser } from "@/data/actions/auth-utils";
import { SubscriptionService } from "@/data/services/subscription";

import { getSubscriptionPlans } from "./subscription.actions";

const sGetAvailablePlans = SubscriptionService.prototype.getAvailablePlans;

const sGetAvailablePlansMock = sGetAvailablePlans as jest.MockedFunction<
   typeof sGetAvailablePlans
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
