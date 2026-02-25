import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { LibraryEntriesGrid } from "./library-entries-grid";

const assertEmptyRendered = () => {
   const empty = screen.getByTestId("library-entries-empty");
   assertInDocument(empty);
};

const assertRendered = () => {
   const entries = screen.getByTestId("library-entries-grid");
   assertInDocument(entries);
};

describe("LibraryEntriesGrid rendering tests", () => {
   it("LibraryEntriesGrid - empty - test", async () => {
      const collections = dtestData.dLibraryCollections();

      const { container } = renderWithReactQuery(
         <LibraryEntriesGrid entries={[]} collections={collections} />
      );

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntriesGrid - with entries - test", async () => {
      const collections = dtestData.dLibraryCollections();
      const entries = dtestData.dLibraryEntries();

      const { container } = renderWithReactQuery(
         <LibraryEntriesGrid entries={entries} collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
