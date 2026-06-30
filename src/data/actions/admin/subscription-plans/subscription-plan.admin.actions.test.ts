jest.mock("@/data/actions/auth-utils");
jest.mock("@/data/services/admin/subscription-plan");

import { adtestData, dtestData } from "@tests";

import { requireAdmin } from "@/data/actions/auth-utils";
import { AdminSubscriptionPlanService } from "@/data/services/admin/subscription-plan";
import { DSubscriptionPlanUpdate } from "@/data/types/domain/admin/admin";
import { ActionResult } from "@/data/types/utils";

import {
   getAdminSubscriptionPlans,
   updateSubscriptionPlan,
} from "./subscription-plan.admin.actions";

const sGetSubscriptionPlans =
   AdminSubscriptionPlanService.prototype.getSubscriptionPlans;

const sUpdateSubscriptionPlan =
   AdminSubscriptionPlanService.prototype.updateSubscriptionPlan;

const requireAdminMock = requireAdmin as jest.MockedFunction<
   typeof requireAdmin
>;

const sGetSubscriptionPlansMock = sGetSubscriptionPlans as jest.MockedFunction<
   typeof sGetSubscriptionPlans
>;
const sUpdateSubscriptionPlanMock =
   sUpdateSubscriptionPlan as jest.MockedFunction<
      typeof sUpdateSubscriptionPlan
   >;

describe("getAdminSubscriptionPlans tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("user not admin - test", async () => {
      const error = new Error("Forbidden");
      requireAdminMock.mockRejectedValue(error);

      await expect(getAdminSubscriptionPlans()).rejects.toThrow();
      expect(requireAdminMock).toHaveBeenCalledTimes(1);
      expect(sGetSubscriptionPlansMock).not.toHaveBeenCalled();
   });

   it("plans retrieved - test", async () => {
      const dAdminUser = dtestData.dLoginUser();
      requireAdminMock.mockResolvedValue(dAdminUser);

      const plans = dtestData.dSubscriptionPlans();
      sGetSubscriptionPlansMock.mockResolvedValue(plans);

      const result = await getAdminSubscriptionPlans();

      expect(result).toEqual(plans);
      expect(requireAdminMock).toHaveBeenCalledTimes(1);
      expect(sGetSubscriptionPlansMock).toHaveBeenCalledTimes(1);
   });
});

describe("updateSubscriptionPlan tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user not admin - test", async () => {
      const error = new Error("Forbidden");
      requireAdminMock.mockRejectedValue(error);

      const planId = "plan-id-1";
      const data = adtestData.dSubscriptionPlanUpdate();

      const result = await updateSubscriptionPlan(planId, data);

      const expected: ActionResult = {
         success: false,
         message: "Plan konnte nicht aktualisiert werden.",
      };
      expect(result).toEqual(expected);
      expect(sUpdateSubscriptionPlanMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("error - test", async () => {
      const dAdminUser = dtestData.dLoginUser();
      requireAdminMock.mockResolvedValue(dAdminUser);

      const dbError = new Error("db error");
      sUpdateSubscriptionPlanMock.mockRejectedValue(dbError);

      const planId = "plan-id-111";
      const data = adtestData.dSubscriptionPlanUpdate();

      const result = await updateSubscriptionPlan(planId, data);

      const expected: ActionResult = {
         success: false,
         message: "Plan konnte nicht aktualisiert werden.",
      };
      expect(result).toEqual(expected);
      expect(sUpdateSubscriptionPlanMock).toHaveBeenCalledTimes(1);
      expect(sUpdateSubscriptionPlanMock).toHaveBeenCalledWith(planId, data);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("updates plan successfully - test", async () => {
      const dAdminUser = dtestData.dLoginUser();
      requireAdminMock.mockResolvedValue(dAdminUser);

      sUpdateSubscriptionPlanMock.mockResolvedValue(undefined);

      const planId = "plan-id-123";
      const data = adtestData.dSubscriptionPlanUpdate();

      const result = await updateSubscriptionPlan(planId, data);

      const expected: ActionResult = {
         success: true,
         message: "Plan erfolgreich aktualisiert.",
      };
      expect(result).toEqual(expected);
      expect(sUpdateSubscriptionPlanMock).toHaveBeenCalledTimes(1);
      expect(sUpdateSubscriptionPlanMock).toHaveBeenCalledWith(planId, data);
   });
});
