jest.mock("@/data/actions/catalog");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getPublishedCatalogEntriesPage } from "@/data/actions/catalog";
import { DCatalogEntriesPageQuery } from "@/data/types/domain/catalog";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

import { CatalogEntryItems } from "./catalog-entry-items";

const getPublishedCatalogEntriesPageMock =
   getPublishedCatalogEntriesPage as jest.MockedFunction<
      typeof getPublishedCatalogEntriesPage
   >;

const assertEmptyRendered = () => {
   const empty = screen.getByTestId("catalog-entries-empty");
   assertInDocument(empty);
};

const assertGridRendered = () => {
   const entries = screen.getByTestId("catalog-entries-grid");
   assertInDocument(entries);
};

const assertListRendered = () => {
   const entries = screen.getByTestId("catalog-entries-list");
   assertInDocument(entries);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DCatalogEntriesPageQuery
) => {
   expect(getPublishedCatalogEntriesPageMock).toHaveBeenCalledTimes(1);
   expect(getPublishedCatalogEntriesPageMock).toHaveBeenCalledWith(
      expectedPayload
   );
};

describe("CatalogEntryItems rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("entries empty - test", async () => {
      const page = dtestData.dCatalogEntriesPage(0);
      getPublishedCatalogEntriesPageMock.mockResolvedValue(page);

      const filters = dtestData.dCatalogEntriesFilter();

      const { container } = renderWithRouter(
         <CatalogEntryItems
            viewMode={DListViewMode.GRID}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_DESC}
            filters={filters}
         />
      );

      const expectedPayload: DCatalogEntriesPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: filters,
         sort: { field: "createdAt", order: "desc" },
      };

      await waitFor(() => {
         assertEmptyRendered();
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });

   it("view grid - test", async () => {
      const page = dtestData.dCatalogEntriesPage();
      getPublishedCatalogEntriesPageMock.mockResolvedValue(page);

      const filters = dtestData.dCatalogEntriesFilter();

      const { container } = renderWithRouter(
         <CatalogEntryItems
            viewMode={DListViewMode.GRID}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_DESC}
            filters={filters}
         />
      );

      const expectedPayload: DCatalogEntriesPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: filters,
         sort: { field: "createdAt", order: "desc" },
      };

      await waitFor(() => {
         assertGridRendered();
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });

   it("view list - test", async () => {
      const page = dtestData.dCatalogEntriesPage();
      getPublishedCatalogEntriesPageMock.mockResolvedValue(page);

      const filters = dtestData.dCatalogEntriesFilter();

      const { container } = renderWithRouter(
         <CatalogEntryItems
            viewMode={DListViewMode.LIST}
            groupBy={DListGroupByMode.NONE}
            sortBy={DListSortByMode.DATE_ASC}
            filters={filters}
         />
      );

      const expectedPayload: DCatalogEntriesPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: filters,
         sort: { field: "createdAt", order: "asc" },
      };

      await waitFor(() => {
         assertListRendered();
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });
});
