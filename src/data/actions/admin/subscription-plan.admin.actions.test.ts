jest.mock("@/data/actions/auth-utils");
jest.mock("@/data/services/admin/subscription-plan");

import { dtestData } from "@tests";

import { requireAdmin } from "@/data/actions/auth-utils";
import { AdminSubscriptionPlanService } from "@/data/services/admin/subscription-plan";
import { DSubscriptionPlanUpdateInput } from "@/data/types/domain/admin/admin";
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

const dAdminUser = dtestData.dLoginUser();

const validInput: DSubscriptionPlanUpdateInput = {
   name: "Updated Plan",
   description: "Updated description",
   monthlyPrice: 19.9,
   yearlyPrice: 199.0,
   isActive: true,
};

describe("getAdminSubscriptionPlans tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("throws when not admin - test", async () => {
      requireAdminMock.mockRejectedValue(new Error("Forbidden"));

      await expect(getAdminSubscriptionPlans()).rejects.toThrow();
      expect(requireAdminMock).toHaveBeenCalledTimes(1);
      expect(sGetSubscriptionPlansMock).not.toHaveBeenCalled();
   });

   it("returns plans - test", async () => {
      const plans = dtestData.dSubscriptionPlans(2);
      requireAdminMock.mockResolvedValue(dAdminUser);
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

   it("returns error when not admin - test", async () => {
      requireAdminMock.mockRejectedValue(new Error("Forbidden"));

      const result = await updateSubscriptionPlan("plan-id-1", validInput);

      const expected: ActionResult = {
         success: false,
         message: "Plan konnte nicht aktualisiert werden.",
      };
      expect(result).toEqual(expected);
      expect(sUpdateSubscriptionPlanMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("updates plan successfully - test", async () => {
      requireAdminMock.mockResolvedValue(dAdminUser);
      sUpdateSubscriptionPlanMock.mockResolvedValue(undefined);

      const result = await updateSubscriptionPlan("plan-id-1", validInput);

      const expected: ActionResult = {
         success: true,
         message: "Plan erfolgreich aktualisiert.",
      };
      expect(result).toEqual(expected);
      expect(sUpdateSubscriptionPlanMock).toHaveBeenCalledTimes(1);
      expect(sUpdateSubscriptionPlanMock).toHaveBeenCalledWith(
         "plan-id-1",
         validInput
      );
   });

   it("returns error on service failure - test", async () => {
      requireAdminMock.mockResolvedValue(dAdminUser);
      sUpdateSubscriptionPlanMock.mockRejectedValue(new Error("db error"));

      const result = await updateSubscriptionPlan("plan-id-1", validInput);

      const expected: ActionResult = {
         success: false,
         message: "Plan konnte nicht aktualisiert werden.",
      };
      expect(result).toEqual(expected);
      expect(console.error).toHaveBeenCalledWith("db error");
   });
});
