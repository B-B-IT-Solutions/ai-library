jest.mock("@/data/actions/library");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import {
   getLibraryCollections,
   getLibraryEntriesPage,
} from "@/data/actions/library";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

import { LibraryEntries } from "./library-entries";

const getLibraryCollectionsMock = getLibraryCollections as jest.MockedFunction<
   typeof getLibraryCollections
>;

const getLibraryEntriesPageMock = getLibraryEntriesPage as jest.MockedFunction<
   typeof getLibraryEntriesPage
>;

const assertGridRendered = () => {
   const entries = screen.getByTestId("library-entries-grid");
   assertInDocument(entries);
};

const assertListRendered = () => {
   const entries = screen.getByTestId("library-entries-list");
   assertInDocument(entries);
};

const assertGroupsendered = () => {
   const entries = screen.getByTestId("library-entries-groups");
   assertInDocument(entries);
};

describe("LibraryDashboard rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dLibraryEntriesPage();

      getLibraryCollectionsMock.mockResolvedValue([]);
      getLibraryEntriesPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("LibraryEntries - view grid - test", async () => {
      const { container } = renderWithRouter(
         <LibraryEntries
            viewMode={DListViewMode.GRID}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_DESC}
            filters={{}}
         />
      );

      await waitFor(() => {
         assertGridRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntries - view list - test", async () => {
      const { container } = renderWithRouter(
         <LibraryEntries
            viewMode={DListViewMode.LIST}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_DESC}
            filters={{}}
         />
      );

      await waitFor(() => {
         assertListRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntries - groups - test", async () => {
      const { container } = renderWithRouter(
         <LibraryEntries
            viewMode={DListViewMode.LIST}
            groupBy={DListGroupByMode.MODEL}
            sortBy={DListSortByMode.DATE_DESC}
            filters={{}}
         />
      );

      await waitFor(() => {
         assertGroupsendered();
      });

      expect(container).toMatchSnapshot();
   });
});
