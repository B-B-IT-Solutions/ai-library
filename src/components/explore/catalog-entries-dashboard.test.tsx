jest.mock("@/data/actions/catalog");
jest.mock("./catalog-search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import {
   getCatalogEntryCategories,
   getPublishedCatalogEntriesPage,
} from "@/data/actions/catalog";
import { DCatalogEntriesPageQuery } from "@/data/types/domain/catalog";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

import { CatalogEntriesDashboard } from "./catalog-entries-dashboard";
import { catalogEntrySearchParamsCache } from "./catalog-search-params";

type CacheKey = Parameters<typeof catalogEntrySearchParamsCache.get>[0];
type CacheValue = ReturnType<typeof catalogEntrySearchParamsCache.get>;

const getCatalogEntryCategoriesMock =
   getCatalogEntryCategories as jest.MockedFunction<
      typeof getCatalogEntryCategories
   >;

const getPublishedCatalogEntriesPageMock =
   getPublishedCatalogEntriesPage as jest.MockedFunction<
      typeof getPublishedCatalogEntriesPage
   >;

const exploreSearchParamsCacheMock =
   catalogEntrySearchParamsCache as DeepMockProxy<
      typeof catalogEntrySearchParamsCache
   >;

const mockSearchParams = (key: CacheKey): CacheValue => {
   switch (key) {
      case "view":
         return DListViewMode.GRID;
      case "group":
         return DListGroupByMode.NONE;
      case "sort":
         return DListSortByMode.DATE_DESC;
      case "f_search":
         return "test-1";
      case "f_categories":
         return ["cat-1"];
   }
};

const assertRendered = () => {
   const dashboard = screen.getByTestId("catalog-entries-dashboard");
   const filter = screen.getByTestId("catalog-entries-filter");
   const entries = screen.getByTestId("catalog-entries-grid");

   assertInDocument(dashboard);
   assertInDocument(filter);
   assertInDocument(entries);
};

const assertGetCatalogEntriesPageCalled = (
   expectedPayload: DCatalogEntriesPageQuery
) => {
   expect(getPublishedCatalogEntriesPageMock).toHaveBeenCalledTimes(1);
   expect(getPublishedCatalogEntriesPageMock).toHaveBeenCalledWith(
      expectedPayload
   );
};

describe("CatalogEntriesDashboard rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dCatalogEntriesPage();
      getPublishedCatalogEntriesPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered test", async () => {
      exploreSearchParamsCacheMock.get.mockImplementation(mockSearchParams);

      const categories = dtestData.dCatalogEntryCategories();
      getCatalogEntryCategoriesMock.mockResolvedValue(categories);

      const { container } = await renderAsyncRSC(CatalogEntriesDashboard, {});

      const expectedPayload: DCatalogEntriesPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: {
            categories: mockSearchParams("f_categories"),
            search: mockSearchParams("f_search"),
         },
         sort: {
            field: "createdAt",
            order: "desc",
         },
      };

      await waitFor(() => {
         assertRendered();
         expect(getCatalogEntryCategoriesMock).toHaveBeenCalledTimes(1);
         assertGetCatalogEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });
});
