jest.mock("@/data/actions/catalog");
jest.mock("@/data/actions/auth-utils");
jest.mock("./catalog-search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import { parseAsString, parseAsStringEnum } from "nuqs/server";

import { isAuthenticated } from "@/data/actions/auth-utils";
import {
   getCatalogEntryCategories,
   getPublishedCatalogEntriesPage,
} from "@/data/actions/catalog";
import { DCatalogEntriesPageQuery } from "@/data/types/domain/catalog";
import { DListSortByMode, DListViewMode } from "@/data/types/domain/common";

import { CatalogEntriesDashboard } from "./catalog-entries-dashboard";
import {
   catalogEntrySearchParamsCache,
   f_searchParam,
   sortByParam,
} from "./catalog-search-params";

type CacheKey = Parameters<typeof catalogEntrySearchParamsCache.get>[0];
type CacheValue = ReturnType<typeof catalogEntrySearchParamsCache.get>;

const getCatalogEntryCategoriesMock =
   getCatalogEntryCategories as jest.MockedFunction<
      typeof getCatalogEntryCategories
   >;

const isAuthenticatedMock = isAuthenticated as jest.MockedFunction<
   typeof isAuthenticated
>;

const getPublishedCatalogEntriesPageMock =
   getPublishedCatalogEntriesPage as jest.MockedFunction<
      typeof getPublishedCatalogEntriesPage
   >;

const searchParamMock = f_searchParam as DeepMockProxy<typeof f_searchParam>;

const sortByParamMock = sortByParam as DeepMockProxy<typeof sortByParam>;

const exploreSearchParamsCacheMock =
   catalogEntrySearchParamsCache as DeepMockProxy<
      typeof catalogEntrySearchParamsCache
   >;

const mockSearchParam = () => {
   return parseAsString.withDefault("");
};

const mockSortByParam = () => {
   return parseAsStringEnum<DListSortByMode>(
      Object.values(DListSortByMode)
   ).withDefault(DListSortByMode.DATE_DESC);
};

const mockSearchParams = (key: CacheKey): CacheValue => {
   switch (key) {
      case "view":
         return DListViewMode.GRID;
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
   const sidebar = screen.getByTestId("catalog-entries-sidebar");
   const toolbar = screen.getByTestId("catalog-entries-toolbar");
   const entries = screen.getByTestId("catalog-entries-grid");

   assertInDocument(dashboard);
   assertInDocument(sidebar);
   assertInDocument(toolbar);
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

      const sortByMock = mockSortByParam();
      sortByParamMock.withOptions.mockReturnValue(sortByMock);

      const searchMock = mockSearchParam();
      searchParamMock.withOptions.mockReturnValue(searchMock);

      const categories = dtestData.dCatalogEntryCategories();
      getCatalogEntryCategoriesMock.mockResolvedValue(categories);

      isAuthenticatedMock.mockResolvedValue(false);

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
