jest.mock("@/data/services/subscription");
jest.mock("@/data/actions/auth-utils");
jest.mock("next/cache");

import { dtestData } from "@tests";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/data/actions/auth-utils";
import { SubscriptionService } from "@/data/services/subscription";
import { DTrialStatus } from "@/data/types/domain/subscription";

import {
   chooseFreeplan,
   getHasActiveAccess,
   getSubscription,
   getSubscriptionPlans,
   getTrialStatus,
} from "./subscription.actions";

const sGetAvailablePlans = SubscriptionService.prototype.getAvailablePlans;
const sGetSubscription = SubscriptionService.prototype.getSubscription;
const sHasActiveAccess = SubscriptionService.prototype.hasActiveAccess;
const sGetTrialStatus = SubscriptionService.prototype.getTrialStatus;
const sSetPlanChosen = SubscriptionService.prototype.setPlanChosen;

const sGetAvailablePlansMock = sGetAvailablePlans as jest.MockedFunction<
   typeof sGetAvailablePlans
>;
const sGetSubscriptionMock = sGetSubscription as jest.MockedFunction<
   typeof sGetSubscription
>;
const sHasActiveAccessMock = sHasActiveAccess as jest.MockedFunction<
   typeof sHasActiveAccess
>;
const sGetTrialStatusMock = sGetTrialStatus as jest.MockedFunction<
   typeof sGetTrialStatus
>;
const sSetPlanChosenMock = sSetPlanChosen as jest.MockedFunction<
   typeof sSetPlanChosen
>;

const revalidatePathMock = revalidatePath as jest.MockedFunction<
   typeof revalidatePath
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

describe("getSubscription tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getSubscription - user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const fn = () => getSubscription();

      await expect(fn).rejects.toThrow(error);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetSubscriptionMock).not.toHaveBeenCalled();
   });

   it("getSubscription - subscription retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      const subscription = dtestData.dSubscription();

      requireUserMock.mockResolvedValue(user);
      sGetSubscriptionMock.mockResolvedValue(subscription);

      const result = await getSubscription();

      expect(result).toEqual(subscription);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetSubscriptionMock).toHaveBeenCalledTimes(1);
      expect(sGetSubscriptionMock).toHaveBeenCalledWith(user.id);
   });
});

describe("getHasActiveAccess tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await getHasActiveAccess();

      expect(result).toBe(false);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sHasActiveAccessMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("active access - true - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sHasActiveAccessMock.mockResolvedValue(true);

      const result = await getHasActiveAccess();

      expect(result).toBe(true);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sHasActiveAccessMock).toHaveBeenCalledTimes(1);
      expect(sHasActiveAccessMock).toHaveBeenCalledWith(user.id);
   });

   it("active access - false - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sHasActiveAccessMock.mockResolvedValue(false);

      const result = await getHasActiveAccess();

      expect(result).toBe(false);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sHasActiveAccessMock).toHaveBeenCalledTimes(1);
      expect(sHasActiveAccessMock).toHaveBeenCalledWith(user.id);
   });
});

describe("getTrialStatus tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user undefined - test", async () => {
      const error = new Error("Unknown user");
      requireUserMock.mockRejectedValue(error);

      const result = await getTrialStatus();

      expect(result).toBeNull();
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTrialStatusMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("trial status retrieved - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const trialStatus = dtestData.dTrialStatus();
      sGetTrialStatusMock.mockResolvedValue(trialStatus);

      const result = await getTrialStatus();

      expect(result).toEqual(trialStatus);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sGetTrialStatusMock).toHaveBeenCalledTimes(1);
      expect(sGetTrialStatusMock).toHaveBeenCalledWith(user.id);
   });
});

describe("chooseFreeplan tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("chooseFreeplan - success - sets planChosenAt and revalidates - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sSetPlanChosenMock.mockResolvedValue(undefined);

      const result = await chooseFreeplan();

      expect(result.success).toBe(true);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(sSetPlanChosenMock).toHaveBeenCalledWith(user.id);
      expect(revalidatePathMock).toHaveBeenCalledWith("/", "layout");
   });

   it("chooseFreeplan - requireUser throws - returns failure - test", async () => {
      requireUserMock.mockRejectedValue(new Error("Unauthenticated"));

      const result = await chooseFreeplan();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Fehler beim Wählen des Plans");
      expect(sSetPlanChosenMock).not.toHaveBeenCalled();
   });

   it("chooseFreeplan - service throws - returns failure - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      sSetPlanChosenMock.mockRejectedValue(new Error("DB error"));

      const result = await chooseFreeplan();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Fehler beim Wählen des Plans");
   });
});
