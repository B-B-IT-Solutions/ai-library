import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { SubscriptionStatus } from "./subscription-status";

const assertFreeRendered = () => {
   const status = screen.getByTestId("subscription-free-plan");
   const viewPlansLink = screen.getByTestId("view-plans-link");

   assertInDocument(status);
   assertInDocument(viewPlansLink);
};

const assertPaidRendered = () => {
   const status = screen.getByTestId("subscription-paid-plan");
   const manageBillingBtn = screen.getByTestId("manage-billing-btn");

   assertInDocument(status);
   assertInDocument(manageBillingBtn);
};

const assertCurrentPeriodEndRendered = () => {
   const currentPeriodEnd = screen.getByTestId("current-period-end");
   assertInDocument(currentPeriodEnd);
};

const assertCurrentPeriodEndNotRendered = () => {
   const currentPeriodEnd = screen.queryByTestId("current-period-end");
   assertNotInDocument(currentPeriodEnd);
};

const assertCancelAtPeriodEndRendered = () => {
   const cancelAtPeriodEnd = screen.getByTestId("cancel-at-period-end");
   assertInDocument(cancelAtPeriodEnd);
};

const assertCancelAtPeriodEndNotRendered = () => {
   const cancelAtPeriodEnd = screen.queryByTestId("cancel-at-period-end");
   assertNotInDocument(cancelAtPeriodEnd);
};

const assertCancelBtnRendered = () => {
   const cancelSubscriptionBtn = screen.getByTestId("cancel-subscription-btn");
   assertInDocument(cancelSubscriptionBtn);
};

const assertCancelBtnNotRendered = () => {
   const cancelSubscriptionBtn = screen.queryByTestId(
      "cancel-subscription-btn"
   );
   assertNotInDocument(cancelSubscriptionBtn);
};

const assertReactivateBtnRendered = () => {
   const reactivateBtn = screen.getByTestId("reactivate-subscription-btn");
   assertInDocument(reactivateBtn);
};

const assertReactivateBtnNotRendered = () => {
   const reactivateBtn = screen.queryByTestId("reactivate-subscription-btn");
   assertNotInDocument(reactivateBtn);
};

describe("SubscriptionStatus rendering tests", () => {
   it("Subscription - free plan - test", async () => {
      const { container } = render(<SubscriptionStatus subscription={null} />);

      await waitFor(() => {
         assertFreeRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("Subscription - paid plan - active - test", async () => {
      const subscription = dtestData.dSubscription();
      subscription.status = "ACTIVE";
      subscription.cancelAtPeriodEnd = false;

      const { container } = render(
         <SubscriptionStatus subscription={subscription} />
      );

      await waitFor(() => {
         assertPaidRendered();
         assertCurrentPeriodEndRendered();
         assertCancelBtnRendered();
         assertCancelAtPeriodEndNotRendered();
         assertReactivateBtnNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("Subscription - paid plan - canceled - test", async () => {
      const subscription = dtestData.dSubscription();
      subscription.status = "CANCELED";
      subscription.cancelAtPeriodEnd = true;

      const { container } = render(
         <SubscriptionStatus subscription={subscription} />
      );

      await waitFor(() => {
         assertPaidRendered();
         assertCurrentPeriodEndRendered();
         assertCancelAtPeriodEndRendered();
         assertReactivateBtnRendered();
         assertCancelBtnNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("Subscription - paid plan - past due date - test", async () => {
      const subscription = dtestData.dSubscription();
      subscription.status = "PAST_DUE";
      subscription.cancelAtPeriodEnd = false;

      const { container } = render(
         <SubscriptionStatus subscription={subscription} />
      );

      await waitFor(() => {
         assertPaidRendered();
         assertCancelBtnRendered();
         assertCancelAtPeriodEndNotRendered();
         assertReactivateBtnNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("Subscription - paid plan - paused - test", async () => {
      const subscription = dtestData.dSubscription();
      subscription.status = "PAUSED";
      subscription.cancelAtPeriodEnd = false;
      subscription.currentPeriodEnd = null;

      const { container } = render(
         <SubscriptionStatus subscription={subscription} />
      );

      await waitFor(() => {
         assertPaidRendered();
         assertCancelBtnRendered();
         assertCurrentPeriodEndNotRendered();
         assertCancelAtPeriodEndNotRendered();
         assertReactivateBtnNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
