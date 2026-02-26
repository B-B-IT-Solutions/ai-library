import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { LibraryEntryView } from "./library-entry-view";

const assertRendered = () => {
   const libraryEntry = screen.getByTestId("library-entry-details");
   const shortDescription = screen.getByTestId("short-description");
   const longDescription = screen.getByTestId("long-description");
   const content = screen.getByTestId("prompt-text");
   const createPromptBtn = screen.getByTestId("create-prompt-btn");
   const editEntryBtn = screen.getByTestId("edit-entry-btn");
   const moreOptionsBtn = screen.getByTestId("more-options-btn");
   // const downloadBtn = screen.getByTestId("download-template-btn");

   assertInDocument(libraryEntry);
   assertInDocument(shortDescription);
   assertInDocument(longDescription);
   assertInDocument(content);
   assertInDocument(createPromptBtn);
   assertInDocument(editEntryBtn);
   assertInDocument(moreOptionsBtn);
   // assertInDocument(downloadBtn);
};

const assertCategoriesRendered = () => {
   const categories = screen.getByTestId("categories");
   assertInDocument(categories);
};

const assertCategoriesNotRendered = () => {
   const categories = screen.queryByTestId("categories");
   assertNotInDocument(categories);
};

describe("LibraryEntryDetails rendering tests", () => {
   it("LibraryEntryDetails - categories empty - rendered test", async () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();
      entry.templateDescriptor.categories = [];

      const { container } = render(<LibraryEntryView entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertCategoriesNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntryDetails - with categories - rendered test", async () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();

      const { container } = render(<LibraryEntryView entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertCategoriesRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
