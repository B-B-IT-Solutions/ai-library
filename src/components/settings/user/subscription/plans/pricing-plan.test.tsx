import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { PricingPlan } from "./pricing-plan";

const assertRendered = () => {
   const plan = screen.getByTestId("pricing-plan");
   const features = screen.getByTestId("features");

   assertInDocument(plan);
   assertInDocument(features);
};

const assertPopularBadgeRendered = () => {
   const badge = screen.getByTestId("popular-badge");
   assertInDocument(badge);
};

const assertPopularBadgeNotRendered = () => {
   const badge = screen.queryByTestId("popular-badge");
   assertNotInDocument(badge);
};

const assertActivateBtnRendered = () => {
   const btn = screen.getByTestId("activate-subscription-btn");
   assertInDocument(btn);
};

const assertActivateBtnNotRendered = () => {
   const btn = screen.queryByTestId("activate-subscription-btn");
   assertNotInDocument(btn);
};

const assertFreeBtnRendered = () => {
   const btn = screen.getByTestId("free-btn");
   assertInDocument(btn);
};

const assertFreeBtnNotRendered = () => {
   const btn = screen.queryByTestId("free-btn");
   assertNotInDocument(btn);
};

const assertCurrentBtnRendered = () => {
   const btn = screen.getByTestId("current-btn");
   assertInDocument(btn);
};

const assertCurrentBtnNotRendered = () => {
   const btn = screen.queryByTestId("current-btn");
   assertNotInDocument(btn);
};

describe("PricingPlan rendering tests", () => {
   it("PricingPlan - tier PRO - test", async () => {
      const plan = dtestData.dSubscriptionPlan();
      plan.tier = "PRO";
      plan.features.maxPrompts = -1;
      plan.features.maxCollections = -1;
      plan.features.canPurchaseItems = true;
      plan.features.canExportPrompts = true;
      plan.features.canUseAdvancedFeatures = true;

      const { container } = render(
         <PricingPlan plan={plan} billingInterval="YEARLY" isCurrent={true} />
      );

      await waitFor(() => {
         assertRendered();
         assertPopularBadgeRendered();
         assertCurrentBtnRendered();
         assertFreeBtnNotRendered();
         assertActivateBtnNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PricingPlan - tier BASIC - test", async () => {
      const plan = dtestData.dSubscriptionPlan();
      plan.tier = "BASIC";
      plan.features.canAccessMarketplace = false;

      const { container } = render(
         <PricingPlan plan={plan} billingInterval="MONTHLY" isCurrent={false} />
      );

      await waitFor(() => {
         assertRendered();
         assertPopularBadgeNotRendered();
         assertActivateBtnRendered();
         assertFreeBtnNotRendered();
         assertCurrentBtnNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PricingPlan - tier FREE - current false - test", async () => {
      const plan = dtestData.dSubscriptionPlan();
      plan.tier = "FREE";

      const { container } = render(
         <PricingPlan plan={plan} billingInterval="MONTHLY" isCurrent={false} />
      );

      await waitFor(() => {
         assertRendered();
         assertFreeBtnRendered();
         assertPopularBadgeNotRendered();
         assertCurrentBtnNotRendered();
         assertActivateBtnNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PricingPlan - tier FREE - current true - test", async () => {
      const plan = dtestData.dSubscriptionPlan();
      plan.tier = "FREE";

      const { container } = render(
         <PricingPlan plan={plan} billingInterval="MONTHLY" isCurrent={true} />
      );

      await waitFor(() => {
         assertRendered();
         assertFreeBtnRendered();
         assertPopularBadgeNotRendered();
         assertCurrentBtnNotRendered();
         assertActivateBtnNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
