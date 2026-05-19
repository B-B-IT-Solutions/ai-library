jest.mock("@/data/actions/subscription");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import {
   getSubscription,
   getSubscriptionPlans,
} from "@/data/actions/subscription";

import { metadata, PricingPage } from "./page";

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

   it("rendered - test", async () => {
      const subscription = dtestData.dSubscription();
      const plans = dtestData.dSubscriptionPlans();

      getSubscriptionMock.mockResolvedValue(subscription);
      getSubscriptionPlansMock.mockResolvedValue(plans);

      const { container } = await renderAsyncRSC(PricingPage, {});

      await waitFor(() => {
         assertRendered();
         expect(getSubscriptionMock).toHaveBeenCalledTimes(1);
         expect(getSubscriptionPlansMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PricingPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
