import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { LibraryEntryView } from "./library-entry-view";

const assertRendered = () => {
   const libraryEntry = screen.getByTestId("library-entry-view");
   const breadcrumb = screen.getByTestId("libary-entry-breadcrumb");
   const form = screen.getByTestId("library-entry-view-form");

   assertInDocument(libraryEntry);
   assertInDocument(breadcrumb);
   assertInDocument(form);
};

describe("LibraryEntryView rendering tests", () => {
   it("rendered test", async () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();

      const { container } = render(<LibraryEntryView entry={entry} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
