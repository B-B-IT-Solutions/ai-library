import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { Settings } from "./settings";

const assertRendered = () => {
   const settingsView = screen.getByTestId("settings-view");
   const tabs = screen.getByTestId("tabs");
   const generalTab = screen.getByTestId("general-tab");
   const accountTab = screen.getByTestId("account-tab");

   assertInDocument(settingsView);
   assertInDocument(tabs);
   assertInDocument(generalTab);
   assertInDocument(accountTab);
};

const assertTabContentRendered = (tab: string) => {
   const content = screen.getByTestId(tab);
   assertInDocument(content);
};

const assertTabContentNotRendered = (tab: string) => {
   const content = screen.queryByTestId(tab);
   assertNotInDocument(content);
};

describe("Settings rendering tests", () => {
   it("Settings - default tab - rendered - test", async () => {
      const user = dtestData.dUser();
      const { container } = render(<Settings user={user} />);

      await waitFor(() => {
         assertRendered();
         assertTabContentRendered("general-settings");
         assertTabContentNotRendered("account-settings");
      });

      expect(container).toMatchSnapshot();
   });
});

describe("Settings functionality tests", () => {
   it("Settings - tab switching - test", async () => {
      const user = dtestData.dUser();
      render(<Settings user={user} />);

      await waitFor(() => {
         assertRendered();
         assertTabContentRendered("general-settings");
         assertTabContentNotRendered("account-settings");
      });

      const accountTab = screen.getByTestId("account-tab");
      userEvent.click(accountTab);

      await waitFor(() => {
         assertTabContentNotRendered("general-settings");
         assertTabContentRendered("account-settings");
      });

      const generalTab = screen.getByTestId("general-tab");
      userEvent.click(generalTab);

      await waitFor(() => {
         assertTabContentRendered("general-settings");
         assertTabContentNotRendered("account-settings");
      });
   });
});
