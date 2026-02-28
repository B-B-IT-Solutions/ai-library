jest.mock("./user/subscription", () => {
   const Subscription = () => <div data-testid="subscription"></div>;
   return { Subscription };
});

jest.mock("./content/global-template-fields", () => {
   const GlobalTemplateFields = () => (
      <div data-testid="global-template-fields"></div>
   );
   return { GlobalTemplateFields };
});

import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { Settings } from "./settings";

const assertRendered = () => {
   const settingsView = screen.getByTestId("settings-view");
   const navigation = screen.getByTestId("navigation");

   assertInDocument(settingsView);
   assertInDocument(navigation);
};

const assertContentRendered = (testId: string) => {
   const content = screen.getByTestId(testId);
   assertInDocument(content);
};

const assertContentNotRendered = (testId: string) => {
   const content = screen.queryByTestId(testId);
   assertNotInDocument(content);
};

describe("Settings rendering tests", () => {
   it("Settings - section general - rendered - test", async () => {
      const user = dtestData.dUser();
      const { container } = render(<Settings user={user} section="general" />);

      await waitFor(() => {
         assertRendered();
         assertContentRendered("general-settings");
         assertContentNotRendered("account-settings");
         assertContentNotRendered("subscription");
         assertContentNotRendered("global-template-fields");
      });

      expect(container).toMatchSnapshot();
   });

   it("Settings - section account - test", async () => {
      const user = dtestData.dUser();
      const { container } = render(<Settings user={user} section="account" />);

      await waitFor(() => {
         assertRendered();
         assertContentRendered("account-settings");
         assertContentNotRendered("general-settings");
         assertContentNotRendered("subscription");
         assertContentNotRendered("global-template-fields");
      });

      expect(container).toMatchSnapshot();
   });

   it("Settings - section subscription - test", async () => {
      const user = dtestData.dUser();
      const { container } = render(
         <Settings user={user} section="subscription" />
      );

      await waitFor(() => {
         assertRendered();
         assertContentRendered("subscription");
         assertContentNotRendered("account-settings");
         assertContentNotRendered("general-settings");
         assertContentNotRendered("global-template-fields");
      });

      expect(container).toMatchSnapshot();
   });

   it("Settings - section global-template-fields - test", async () => {
      const user = dtestData.dUser();
      const { container } = render(
         <Settings user={user} section="global-template-fields" />
      );

      await waitFor(() => {
         assertRendered();
         assertContentRendered("global-template-fields");
         assertContentNotRendered("account-settings");
         assertContentNotRendered("general-settings");
         assertContentNotRendered("subscription");
      });

      expect(container).toMatchSnapshot();
   });
});
