jest.mock("@/data/actions/library");

import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { getLibraryCollections } from "@/data/actions/library";

import { LibraryEntriesList } from "./library-entries-list";

const getLibraryCollectionsMock = getLibraryCollections as jest.MockedFunction<
   typeof getLibraryCollections
>;

const assertEmptyRendered = () => {
   const empty = screen.getByTestId("library-entries-empty");
   assertInDocument(empty);
};

const assertRendered = () => {
   const entries = screen.getByTestId("library-entries-list");
   assertInDocument(entries);
};

describe("LibraryEntriesList rendering tests", () => {
   it("LibraryEntriesList - empty - test", async () => {
      const { container } = renderWithReactQuery(
         <LibraryEntriesList entries={[]} />
      );

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });
   it("LibraryEntriesList - with entries - test", async () => {
      const collections = dtestData.dLibraryCollections();
      getLibraryCollectionsMock.mockResolvedValue(collections);

      const entries = dtestData.dLibraryEntries();
      const { container } = renderWithReactQuery(
         <LibraryEntriesList entries={entries} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
