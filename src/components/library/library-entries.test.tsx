import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { LibraryEntries } from "./library-entries";

const assertRendered = () => {
   const entries = screen.getByTestId("library-entries");
   assertInDocument(entries);
};

const assertLibraryEntryCards = () => {
   const entryCards = screen.getAllByTestId("library-entry-card");
   expect(entryCards).toHaveLength(3);
};

describe("LibraryEntries rendering tests", () => {
   it("LibraryEntries - viewMode grid - rendered test", async () => {
      const entries = dtestData.dLibraryEntries();

      const { container } = renderWithReactQuery(
         <LibraryEntries entries={entries} />
      );

      await waitFor(() => {
         assertRendered();
         assertLibraryEntryCards();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntries - viewMode list - rendered test", async () => {
      const entries = dtestData.dLibraryEntries();

      const { container } = renderWithReactQuery(
         <LibraryEntries entries={entries} />
      );

      await waitFor(() => {
         assertRendered();
         assertLibraryEntryCards();
      });

      expect(container).toMatchSnapshot();
   });
});
