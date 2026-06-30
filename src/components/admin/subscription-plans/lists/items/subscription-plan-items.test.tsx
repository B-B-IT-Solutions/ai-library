import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { SubscriptionPlanItems } from "./subscription-plan-items";

const assertRendered = () => {
   const plans = screen.getByTestId("subscription-plan-items");
   const items = screen.getAllByTestId("subscription-plan");

   assertInDocument(plans);
   expect(items).toHaveLength(3);
};

describe("SubscriptionPlanItems rendering tests", () => {
   it("subtitle undefined - test", async () => {
      const plans = dtestData.dSubscriptionPlans(3);
      const { container } = render(<SubscriptionPlanItems plans={plans} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
