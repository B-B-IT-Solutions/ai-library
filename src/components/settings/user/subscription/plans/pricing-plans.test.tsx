jest.mock("@/components/subscription/buttons/choose-free-plan-button", () => ({
   ChooseFreePlanButton: () => (
      <button data-testid="choose-free-plan-btn">Kostenlos starten</button>
   ),
}));

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
   dtestData,
} from "@tests";

import { PricingPlans } from "./pricing-plans";

const assertRendered = () => {
   const plans = screen.getByTestId("pricing-plans");
   const monthlyBtn = screen.getByTestId("monthly-btn");
   const yearlyBtn = screen.getByTestId("yearly-btn");
   const planItems = screen.getAllByTestId("pricing-plan");

   assertInDocument(plans);
   assertInDocument(monthlyBtn);
   assertInDocument(yearlyBtn);
   expect(planItems).toHaveLength(3);
};

describe("PricingPlans rendering tests", () => {
   it("PricingPlans - currentSubscription null - test", async () => {
      const plans = dtestData.dSubscriptionPlans();

      const { container } = render(
         <PricingPlans plans={plans} currentSubscription={null} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PricingPlans - currentSubscription defined - test", async () => {
      const plans = dtestData.dSubscriptionPlans();
      const subscription = dtestData.dSubscription();
      subscription.plan = plans[1];

      const { container } = render(
         <PricingPlans plans={plans} currentSubscription={subscription} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PricingPlans - currentSubscription null - FREE plan - ChooseFreePlanButton shown - test", async () => {
      const plans = dtestData.dSubscriptionPlans();
      plans[0].tier = "FREE";

      const { container } = render(
         <PricingPlans plans={plans} currentSubscription={null} />
      );

      await waitFor(() => {
         assertRendered();
         assertInDocument(screen.getByTestId("choose-free-plan-btn"));
      });

      expect(container).toMatchSnapshot();
   });

   it("PricingPlans - currentSubscription defined - FREE plan - no ChooseFreePlanButton - test", async () => {
      const plans = dtestData.dSubscriptionPlans();
      plans[0].tier = "FREE";
      const subscription = dtestData.dSubscription();
      subscription.plan = plans[1];

      const { container } = render(
         <PricingPlans plans={plans} currentSubscription={subscription} />
      );

      await waitFor(() => {
         assertRendered();
         assertNotInDocument(screen.queryByTestId("choose-free-plan-btn"));
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PricingPlans functionality tests", () => {
   it("PricingPlans - interval switching - test", async () => {
      const plans = dtestData.dSubscriptionPlans();
      render(<PricingPlans plans={plans} currentSubscription={null} />);

      await waitFor(() => {
         assertRendered();
      });

      const monthlyBtn = screen.getByTestId("monthly-btn");
      const yearlyBtn = screen.getByTestId("yearly-btn");

      assertHasAttributeWithValue(monthlyBtn, "data-active", "false");
      assertHasAttributeWithValue(yearlyBtn, "data-active", "true");

      await userEvent.click(monthlyBtn);
      assertHasAttributeWithValue(monthlyBtn, "data-active", "true");
      assertHasAttributeWithValue(yearlyBtn, "data-active", "false");

      await userEvent.click(yearlyBtn);
      assertHasAttributeWithValue(yearlyBtn, "data-active", "true");
      assertHasAttributeWithValue(monthlyBtn, "data-active", "false");
   });
});
