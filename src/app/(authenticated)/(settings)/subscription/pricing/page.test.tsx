jest.mock("@/data/actions/subscription");
jest.mock("@/components/subscription/buttons/choose-free-plan-button", () => ({
   ChooseFreePlanButton: () => (
      <button data-testid="choose-free-plan-btn">Kostenlos starten</button>
   ),
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, assertNotInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import {
   getSubscription,
   getSubscriptionPlans,
} from "@/data/actions/subscription";

import PricingPage, { metadata } from "./page";

const getSubscriptionMock = getSubscription as jest.MockedFunction<
   typeof getSubscription
>;
const getSubscriptionPlansMock = getSubscriptionPlans as jest.MockedFunction<
   typeof getSubscriptionPlans
>;

const expectedMetadata: Metadata = {
   title: "Preise",
};

const assertRendered = () => {
   const page = screen.getByTestId("pricing-page");
   const plans = screen.getByTestId("pricing-plans");

   assertInDocument(page);
   assertInDocument(plans);
};

describe("PricingPage rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("subscription defined - no ChooseFreePlanButton - test", async () => {
      const subscription = dtestData.dSubscription();
      const plans = dtestData.dSubscriptionPlans();

      getSubscriptionMock.mockResolvedValue(subscription);
      getSubscriptionPlansMock.mockResolvedValue(plans);

      const { container } = await renderAsyncRSC(PricingPage, {});

      await waitFor(() => {
         assertRendered();
         expect(getSubscriptionMock).toHaveBeenCalledTimes(1);
         expect(getSubscriptionPlansMock).toHaveBeenCalledTimes(1);
         assertNotInDocument(screen.queryByTestId("choose-free-plan-btn"));
      });

      expect(container).toMatchSnapshot();
   });

   it("subscription null - ChooseFreePlanButton visible on FREE plan - test", async () => {
      const plans = dtestData.dSubscriptionPlans();
      plans[0].tier = "FREE";

      getSubscriptionMock.mockResolvedValue(null);
      getSubscriptionPlansMock.mockResolvedValue(plans);

      const { container } = await renderAsyncRSC(PricingPage, {});

      await waitFor(() => {
         assertRendered();
         assertInDocument(screen.getByTestId("choose-free-plan-btn"));
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PricingPage functionality tests", () => {
   it("PricingPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
