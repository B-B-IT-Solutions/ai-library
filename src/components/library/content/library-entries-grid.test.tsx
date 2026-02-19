jest.mock("@/data/actions/library");

import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { getLibraryCollections } from "@/data/actions/library";

import { LibraryEntriesGrid } from "./library-entries-grid";

const getLibraryCollectionsMock = getLibraryCollections as jest.MockedFunction<
   typeof getLibraryCollections
>;

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
      const { container } = renderWithReactQuery(
         <LibraryEntriesGrid entries={[]} />
      );

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });
   it("LibraryEntriesGrid - with entries - test", async () => {
      const collections = dtestData.dLibraryCollections();
      getLibraryCollectionsMock.mockResolvedValue(collections);

      const entries = dtestData.dLibraryEntries();
      const { container } = renderWithReactQuery(
         <LibraryEntriesGrid entries={entries} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
