jest.mock("@/data/actions/admin/subscription-plans");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import { toast } from "sonner";

import { updateSubscriptionPlan } from "@/data/actions/admin/subscription-plans";
import { ActionResult } from "@/data/types/utils";

import { initSubscriptionPlanUpdate } from "./init-values";
import { SubscriptionPlan } from "./subscription-plan";

const updateSubscriptionPlanMock =
   updateSubscriptionPlan as jest.MockedFunction<typeof updateSubscriptionPlan>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const form = screen.getByTestId("subscription-plan");
   const saveBtn = screen.getByTestId("save-btn");

   assertInDocument(form);
   assertInDocument(saveBtn);
};

describe("SubscriptionPlan rendering tests", () => {
   test("allValues defined - test", async () => {
      const plan = dtestData.dSubscriptionPlan();

      const { container } = render(<SubscriptionPlan plan={plan} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   test("values undefined  - test", async () => {
      const plan = dtestData.dSubscriptionPlan();
      plan.stripeProductId = null;
      plan.stripePriceIdMonthly = null;
      plan.stripePriceIdYearly = null;

      const { container } = render(<SubscriptionPlan plan={plan} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("SubscriptionPlan functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("submit - success - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Plan erfolgreich aktualisiert.",
      };
      updateSubscriptionPlanMock.mockResolvedValue(result);

      const plan = dtestData.dSubscriptionPlan();

      render(<SubscriptionPlan plan={plan} />);

      await waitFor(() => {
         assertRendered();
      });

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      const expectedPayload = initSubscriptionPlanUpdate(plan);

      await waitFor(() => {
         expect(updateSubscriptionPlanMock).toHaveBeenCalledTimes(1);
         expect(updateSubscriptionPlanMock).toHaveBeenCalledWith(
            plan.id,
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
      });
   });

   test("submit - error - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Plan konnte nicht aktualisiert werden.",
      };
      updateSubscriptionPlanMock.mockResolvedValue(result);

      const plan = dtestData.dSubscriptionPlan();

      render(<SubscriptionPlan plan={plan} />);

      await waitFor(() => {
         assertRendered();
      });

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      const expectedPayload = initSubscriptionPlanUpdate(plan);

      await waitFor(() => {
         expect(updateSubscriptionPlanMock).toHaveBeenCalledTimes(1);
         expect(updateSubscriptionPlanMock).toHaveBeenCalledWith(
            plan.id,
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
      });
   });
});
