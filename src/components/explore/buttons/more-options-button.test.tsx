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
   const viewItem = screen.getByTestId("view-entry-menu-item");
   const addToLibraryItem = screen.getByTestId(
      "add-entry-to-library-menu-item"
   );

   assertInDocument(viewItem);
   assertInDocument(addToLibraryItem);
};

const assertMenuNotRendered = () => {
   const viewItem = screen.queryByTestId("view-entry-menu-item");
   const addToLibraryItem = screen.queryByTestId(
      "add-entry-to-library-menu-item"
   );

   assertNotInDocument(viewItem);
   assertNotInDocument(addToLibraryItem);
};

const assertAuthDialogRendered = () => {
   const dialog = screen.getByTestId("auth-required-dialog");
   assertInDocument(dialog);
};

const assertAuthDialogNotRendered = () => {
   const dialog = screen.queryByTestId("auth-required-dialog");
   assertNotInDocument(dialog);
};

describe("CatalogEntryMoreOptionsButton rendering tests", () => {
   it("rendered - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      const { container } = render(
         <CatalogEntryMoreOptionsButton entry={entry} isAuthenticated={false} />
      );

      await waitFor(() => {
         assertRendered();
         assertMenuNotRendered();
         assertAuthDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CatalogEntryMoreOptionsButton functionality tests", () => {
   it("trigger clicked - menu opens - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      render(
         <CatalogEntryMoreOptionsButton entry={entry} isAuthenticated={false} />
      );

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

   it("unauthenticated - add to library clicked - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      render(
         <CatalogEntryMoreOptionsButton entry={entry} isAuthenticated={false} />
      );

      await waitFor(() => {
         assertRendered();
         assertMenuNotRendered();
         assertAuthDialogNotRendered();
      });

      const trigger = screen.getByTestId("trigger-btn");
      await userEvent.click(trigger);

      await waitFor(() => {
         assertMenuRendered();
         assertAuthDialogNotRendered();
      });

      const addItem = screen.getByTestId("add-entry-to-library-menu-item");
      await userEvent.click(addItem);

      await waitFor(() => {
         assertAuthDialogRendered();
      });
   });
});
