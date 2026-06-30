jest.mock("@/data/actions/auth-utils");
jest.mock("@/data/repositories/prisma", () => ({
   __esModule: true,
   default: {
      subscriptionPlan: {
         update: jest.fn(),
      },
   },
}));

import { dtestData } from "@tests";

import { requireAdmin } from "@/data/actions/auth-utils";
import prisma from "@/data/repositories/prisma";
import { ActionResult } from "@/data/types/utils";

import { updateSubscriptionPlan } from "./subscription-plan.admin.actions";

const requireAdminUserMock = requireAdmin as jest.MockedFunction<
   typeof requireAdmin
>;
const prismaMock = prisma as {
   subscriptionPlan: {
      update: jest.MockedFunction<typeof prisma.subscriptionPlan.update>;
   };
};

const dAdminUser = dtestData.dLoginUser();

const validInput = {
   name: "Test Plan",
   description: "Test description",
   monthlyPrice: 9.99,
   yearlyPrice: 99.99,
   isActive: true,
};

describe("updateSubscriptionPlan tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("returns error when not admin - test", async () => {
      const error = new Error("Forbidden");
      requireAdminUserMock.mockRejectedValue(error);

      const result = await updateSubscriptionPlan("plan-id-1", validInput);

      const expected: ActionResult = {
         success: false,
         message: "Plan konnte nicht aktualisiert werden.",
      };
      expect(result).toEqual(expected);
      expect(prismaMock.subscriptionPlan.update).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("updates plan successfully - test", async () => {
      requireAdminUserMock.mockResolvedValue(dAdminUser);
      prismaMock.subscriptionPlan.update.mockResolvedValue({} as never);

      const result = await updateSubscriptionPlan("plan-id-1", validInput);

      const expected: ActionResult = {
         success: true,
         message: "Plan erfolgreich aktualisiert.",
      };
      expect(result).toEqual(expected);
      expect(prismaMock.subscriptionPlan.update).toHaveBeenCalledWith({
         where: { id: "plan-id-1" },
         data: {
            name: validInput.name,
            description: validInput.description,
            monthlyPrice: validInput.monthlyPrice,
            yearlyPrice: validInput.yearlyPrice,
            isActive: validInput.isActive,
         },
      });
   });

   it("returns error on prisma failure - test", async () => {
      requireAdminUserMock.mockResolvedValue(dAdminUser);
      const error = new Error("db error");
      prismaMock.subscriptionPlan.update.mockRejectedValue(error);

      const result = await updateSubscriptionPlan("plan-id-1", validInput);

      const expected: ActionResult = {
         success: false,
         message: "Plan konnte nicht aktualisiert werden.",
      };
      expect(result).toEqual(expected);
      expect(console.error).toHaveBeenCalledWith("db error");
   });
});
