import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { LibraryEntryView } from "./library-entry-view";

const assertRendered = () => {
   const libraryEntry = screen.getByTestId("library-entry-view");
   const shortDescription = screen.getByTestId("short-description");
   const longDescription = screen.getByTestId("long-description");
   const content = screen.getByTestId("prompt-text");
   const createPromptBtn = screen.getByTestId("create-prompt-btn");
   const editEntryBtn = screen.getByTestId("edit-entry-btn");
   const moreOptionsBtn = screen.getByTestId("more-options-btn");

   assertInDocument(libraryEntry);
   assertInDocument(shortDescription);
   assertInDocument(longDescription);
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
   assertInDocument(downloadBtn);
};

const assertContextMenuNotRendered = () => {
   const downloadBtn = screen.queryByTestId("download-template-menu-item");
   assertNotInDocument(downloadBtn);
};

describe("LibraryEntryView rendering tests", () => {
   it("LibraryEntryView - categories empty - rendered test", async () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();
      entry.templateDescriptor.categories = [];

      const { container } = render(<LibraryEntryView entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertCategoriesNotRendered();
         assertContextMenuNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntryView - with categories - rendered test", async () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();

      const { container } = render(<LibraryEntryView entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertCategoriesRendered();
         assertContextMenuNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryEntryView functionality tests", () => {
   it("LibraryEntryView - context menu btn clicked - test", async () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();

      render(<LibraryEntryView entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
      });

      const moreOptionsBtn = screen.getByTestId("more-options-btn");
      await userEvent.click(moreOptionsBtn);

      assertContextMenuRendered();
   });
});
