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
import { DLibraryEntriesPageQuery } from "@/data/types/domain/library";

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

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DLibraryEntriesPageQuery
) => {
   expect(getLibraryEntriesPageMock).toHaveBeenCalledTimes(1);
   expect(getLibraryEntriesPageMock).toHaveBeenCalledWith(expectedPayload);
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
      const filters = dtestData.dLibraryEntriesFilter();

      const { container } = renderWithRouter(
         <LibraryEntries
            viewMode={DListViewMode.GRID}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_DESC}
            filters={filters}
         />
      );

      const expectedPayload: DLibraryEntriesPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: filters,
         sort: { field: "date", order: "desc" },
      };

      await waitFor(() => {
         assertGridRendered();
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntries - view list - test", async () => {
      const filters = dtestData.dLibraryEntriesFilter();

      const { container } = renderWithRouter(
         <LibraryEntries
            viewMode={DListViewMode.LIST}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_ASC}
            filters={filters}
         />
      );

      const expectedPayload: DLibraryEntriesPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: filters,
         sort: { field: "date", order: "asc" },
      };

      await waitFor(() => {
         assertListRendered();
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntries - groups - test", async () => {
      const { container } = renderWithRouter(
         <LibraryEntries
            viewMode={DListViewMode.LIST}
            groupBy={DListGroupByMode.MODEL}
            sortBy={DListSortByMode.NAME_ASC}
            filters={{}}
         />
      );

      const expectedPayload: DLibraryEntriesPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: {},
         sort: { field: "name", order: "asc" },
      };

      await waitFor(() => {
         assertGroupsendered();
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });
});
