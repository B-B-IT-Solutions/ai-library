import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { CatalogEntryMoreOptionsButton } from "./more-options-button";

const assertRendered = () => {
   const moreOptionsBtn = screen.getByTestId("catalog-entry-more-options-btn");
   const triggerBtn = screen.getByTestId("trigger-btn");

   assertInDocument(moreOptionsBtn);
   assertInDocument(triggerBtn);
};

const assertMenuRendered = () => {
   const menuItem = screen.getByTestId("view-entry-menu-item");
   assertInDocument(menuItem);
};

const assertMenuNotRendered = () => {
   const menuItem = screen.queryByTestId("view-entry-menu-item");
   assertNotInDocument(menuItem);
};

describe("CatalogEntryMoreOptionsButton rendering tests", () => {
   it("rendered - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      const { container } = render(
         <CatalogEntryMoreOptionsButton entry={entry} />
      );

      await waitFor(() => {
         assertRendered();
         assertMenuNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CatalogEntryMoreOptionsButton functionality tests", () => {
   it("trigger clicked - menu opens - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      render(<CatalogEntryMoreOptionsButton entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertMenuNotRendered();
      });

      const trigger = screen.getByTestId("trigger-btn");
      await userEvent.click(trigger);

      await waitFor(() => {
         assertMenuRendered();
      });
   });
});
