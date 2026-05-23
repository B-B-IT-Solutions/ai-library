import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { DeleteAcount } from "./delete-account";

const assertRendered = () => {
   const account = screen.getByTestId("delete-account");
   assertInDocument(account);
};

const assertDeleteEnabledRendered = () => {
   const dialog = screen.getByTestId("delete-account-dialog");
   const notice = screen.queryByTestId("delete-blocked-notice");

   assertInDocument(dialog);
   assertNotInDocument(notice);
};

const assertDeleteDisabledRendered = () => {
   const notice = screen.getByTestId("delete-blocked-notice");
   const dialog = screen.queryByTestId("delete-account-dialog");

   assertInDocument(notice);
   assertNotInDocument(dialog);
};

describe("DeleteAcount rendering tests", () => {
   it("subscription null - test", async () => {
      const { container } = render(<DeleteAcount subscription={null} />);

      await waitFor(() => {
         assertRendered();
         assertDeleteEnabledRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("subscription CANCELED - test", async () => {
      const subscription = dtestData.dSubscription();
      subscription.status = "CANCELED";

      const { container } = render(
         <DeleteAcount subscription={subscription} />
      );

      await waitFor(() => {
         assertRendered();
         assertDeleteEnabledRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it.each([
      "ACTIVE",
      "INCOMPLETE",
      "PAST_DUE",
      "UNPAID",
      "TRIALING",
      "PAUSED",
   ] as const)("subscription %s - test", async (status) => {
      const subscription = dtestData.dSubscription();
      subscription.status = status;

      render(<DeleteAcount subscription={subscription} />);

      await waitFor(() => {
         assertRendered();
         assertDeleteDisabledRendered();
      });
   });
});
