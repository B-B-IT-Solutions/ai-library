jest.mock("@/data/actions/catalog");

import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { addCatalogEntryToUserTemplates } from "@/data/actions/catalog";
import { DCatalogEntryCopyResult } from "@/data/types/domain/catalog";
import { ActionResult } from "@/data/types/utils";

import { CatalogEntryMoreOptionsButton } from "./more-options-button";

const addEntryToUserTemplatesMock =
   addCatalogEntryToUserTemplates as jest.MockedFunction<
      typeof addCatalogEntryToUserTemplates
   >;

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
   beforeEach(() => {
      jest.clearAllMocks();
   });

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

   it("unauthenticated - add to entry library clicked - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      render(
         <CatalogEntryMoreOptionsButton entry={entry} isAuthenticated={false} />
      );

      await waitFor(() => {
         assertRendered();
         assertMenuNotRendered();
         assertAuthDialogNotRendered();
         expect(addEntryToUserTemplatesMock).not.toHaveBeenCalled();
      });

      const trigger = screen.getByTestId("trigger-btn");
      await userEvent.click(trigger);

      await waitFor(() => {
         assertMenuRendered();
         assertAuthDialogNotRendered();
         expect(addEntryToUserTemplatesMock).not.toHaveBeenCalled();
      });

      const addItem = screen.getByTestId("add-entry-to-library-menu-item");
      await userEvent.click(addItem);

      await waitFor(() => {
         assertAuthDialogRendered();
         expect(addEntryToUserTemplatesMock).not.toHaveBeenCalled();
      });
   });

   it("authenticated - add entry to library clicked - test", async () => {
      const actionResult: ActionResult<DCatalogEntryCopyResult> = {
         success: true,
         message: "Erfolgreich copiert",
         data: {
            templateId: "descriptor-id-1",
         },
      };
      addEntryToUserTemplatesMock.mockResolvedValue(actionResult);

      const entry = dtestData.dCatalogEntry(1);
      render(
         <CatalogEntryMoreOptionsButton entry={entry} isAuthenticated={true} />
      );

      await waitFor(() => {
         assertRendered();
         assertMenuNotRendered();
         assertAuthDialogNotRendered();
         expect(addEntryToUserTemplatesMock).not.toHaveBeenCalled();
      });

      const trigger = screen.getByTestId("trigger-btn");
      await userEvent.click(trigger);

      await waitFor(() => {
         assertMenuRendered();
         assertAuthDialogNotRendered();
         expect(addEntryToUserTemplatesMock).not.toHaveBeenCalled();
      });

      const addItem = screen.getByTestId("add-entry-to-library-menu-item");
      await userEvent.click(addItem);

      await waitFor(() => {
         assertAuthDialogNotRendered();
         expect(addEntryToUserTemplatesMock).toHaveBeenCalledTimes(1);
         expect(addEntryToUserTemplatesMock).toHaveBeenCalledWith(entry.id);
      });
   });
});
