jest.mock("./user/account", () => {
   const AccountSettings = () => <div data-testid="account-settings"></div>;
   return { AccountSettings };
});

jest.mock("./user/subscription", () => {
   const Subscription = () => <div data-testid="subscription"></div>;
   return { Subscription };
});

jest.mock("./content/global-template-fields", () => {
   const GlobalPromptFields = () => (
      <div data-testid="global-template-fields"></div>
   );
   return { GlobalPromptFields };
});

jest.mock("./content/prompt-categories", () => {
   const Categories = () => <div data-testid="prompt-categories"></div>;
   return { Categories };
});

jest.mock("./content/prompt-models", () => {
   const Models = () => <div data-testid="prompt-models"></div>;
   return { Models };
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
   it("section general - rendered - test", async () => {
      const user = dtestData.dUser();
      const { container } = render(<Settings user={user} section="general" />);

      await waitFor(() => {
         assertRendered();
         assertContentRendered("general-settings");
         assertContentNotRendered("account-settings");
         assertContentNotRendered("subscription");
         assertContentNotRendered("global-template-fields");
         assertContentNotRendered("prompt-categories");
         assertContentNotRendered("prompt-models");
      });

      expect(container).toMatchSnapshot();
   });

   it("section account - test", async () => {
      const user = dtestData.dUser();
      const { container } = render(<Settings user={user} section="account" />);

      await waitFor(() => {
         assertRendered();
         assertContentRendered("account-settings");
         assertContentNotRendered("general-settings");
         assertContentNotRendered("subscription");
         assertContentNotRendered("global-template-fields");
         assertContentNotRendered("prompt-categories");
         assertContentNotRendered("prompt-models");
      });

      expect(container).toMatchSnapshot();
   });

   it("section subscription - test", async () => {
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
         assertContentNotRendered("prompt-categories");
         assertContentNotRendered("prompt-models");
      });

      expect(container).toMatchSnapshot();
   });

   it("section global-template-fields - test", async () => {
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
         assertContentNotRendered("prompt-categories");
         assertContentNotRendered("prompt-models");
      });

      expect(container).toMatchSnapshot();
   });

   it("section prompt-categories - test", async () => {
      const user = dtestData.dUser();
      const { container } = render(
         <Settings user={user} section="prompt-categories" />
      );

      await waitFor(() => {
         assertRendered();
         assertContentRendered("prompt-categories");
         assertContentNotRendered("account-settings");
         assertContentNotRendered("general-settings");
         assertContentNotRendered("subscription");
         assertContentNotRendered("global-template-fields");
         assertContentNotRendered("prompt-models");
      });

      expect(container).toMatchSnapshot();
   });

   it("section prompt-models - test", async () => {
      const user = dtestData.dUser();
      const { container } = render(
         <Settings user={user} section="prompt-models" />
      );

      await waitFor(() => {
         assertRendered();
         assertContentRendered("prompt-models");
         assertContentNotRendered("account-settings");
         assertContentNotRendered("general-settings");
         assertContentNotRendered("subscription");
         assertContentNotRendered("global-template-fields");
         assertContentNotRendered("prompt-categories");
      });

      expect(container).toMatchSnapshot();
   });
});
