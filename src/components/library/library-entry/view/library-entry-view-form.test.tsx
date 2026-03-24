import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { LibraryEntryViewForm } from "./library-entry-view-form";

const assertRendered = () => {
   const form = screen.getByTestId("library-entry-view-form");
   const shortDescription = screen.getByTestId("short-description");
   const content = screen.getByTestId("prompt-text");
   const createPromptBtn = screen.getByTestId(
      "create-prompt-from-template-btn"
   );
   const editEntryBtn = screen.getByTestId("edit-entry-btn");
   const moreOptionsBtn = screen.getByTestId("more-options-btn");

   assertInDocument(form);
   assertInDocument(shortDescription);
   assertInDocument(content);
   assertInDocument(createPromptBtn);
   assertInDocument(editEntryBtn);
   assertInDocument(moreOptionsBtn);
};

const assertCategoriesRendered = () => {
   const categories = screen.getByTestId("categories");
   assertInDocument(categories);
};

const assertCategoriesNotRendered = () => {
   const categories = screen.queryByTestId("categories");
   assertNotInDocument(categories);
};

const assertContextMenuRendered = () => {
   const downloadBtn = screen.getByTestId("download-template-menu-item");
   const deleteBtn = screen.getByTestId("delete-entry-menu-item");

   assertInDocument(downloadBtn);
   assertInDocument(deleteBtn);
};

const assertContextMenuNotRendered = () => {
   const downloadBtn = screen.queryByTestId("download-template-menu-item");
   const deleteBtn = screen.queryByTestId("delete-entry-menu-item");

   assertNotInDocument(downloadBtn);
   assertNotInDocument(deleteBtn);
};

describe("LibraryEntryViewForm rendering tests", () => {
   it("categories empty - rendered test", async () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();
      entry.templateDescriptor.categories = [];

      const { container } = render(<LibraryEntryViewForm entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertCategoriesNotRendered();
         assertContextMenuNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("with categories - rendered test", async () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();

      const { container } = render(<LibraryEntryViewForm entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertCategoriesRendered();
         assertContextMenuNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryEntryViewForm functionality tests", () => {
   it("context menu btn clicked - test", async () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();

      render(<LibraryEntryViewForm entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
      });

      const moreOptionsBtn = screen.getByTestId("more-options-btn");
      await userEvent.click(moreOptionsBtn);

      assertContextMenuRendered();
   });
});
