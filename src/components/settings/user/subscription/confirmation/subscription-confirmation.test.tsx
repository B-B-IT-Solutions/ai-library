import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { SubscriptionConfirmation } from "./subscription-confirmation";

const assertRendered = () => {
   const confirmation = screen.getByTestId("subscription-confirmation");
   const promptsLink = screen.getByTestId("prompts-link");
   const subscriptionLink = screen.getByTestId("view-subscription-link");

   assertInDocument(confirmation);
   assertInDocument(promptsLink);
   assertInDocument(subscriptionLink);
};

describe("SubscriptionConfirmation rendering tests", () => {
   it("rendered - test", async () => {
      const { container } = render(<SubscriptionConfirmation />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
