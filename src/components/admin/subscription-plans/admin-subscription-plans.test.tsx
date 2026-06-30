jest.mock("@/data/actions/admin/subscription-plans");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";

import { getAdminSubscriptionPlans } from "@/data/actions/admin/subscription-plans";

import { AdminSubscriptionPlans } from "./admin-subscription-plans";

const getAdminSubscriptionPlansMock =
   getAdminSubscriptionPlans as jest.MockedFunction<
      typeof getAdminSubscriptionPlans
   >;

const assertRendered = () => {
   const plans = screen.getByTestId("admin-subscription-plans");
   const items = screen.getByTestId("subscription-plan-items");

   assertInDocument(plans);
   assertInDocument(items);
};

describe("AdminSubscriptionPlans rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered test", async () => {
      const plans = dtestData.dSubscriptionPlans();
      getAdminSubscriptionPlansMock.mockResolvedValue(plans);

      const { container } = await renderAsyncRSC(AdminSubscriptionPlans, {});

      await waitFor(() => {
         assertRendered();
         expect(getAdminSubscriptionPlans).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});
