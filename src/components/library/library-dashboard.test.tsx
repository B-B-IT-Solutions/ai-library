jest.mock("@/data/actions/library");
jest.mock("./search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import {
   getLibraryCategories,
   getLibraryCollections,
   getLibraryEntriesPage,
   getLibraryModels,
} from "@/data/actions/library";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

import { LibraryDashboard } from "./library-dashboard";
import { librarySearchParamsCache } from "./search-params";

type CacheKey = Parameters<typeof librarySearchParamsCache.get>[0];
type CacheValue = ReturnType<typeof librarySearchParamsCache.get>;

const getLibraryCategoriesMock = getLibraryCategories as jest.MockedFunction<
   typeof getLibraryCategories
>;

const getLibraryModelsMock = getLibraryModels as jest.MockedFunction<
   typeof getLibraryModels
>;

const getLibraryCollectionsMock = getLibraryCollections as jest.MockedFunction<
   typeof getLibraryCollections
>;

const getLibraryEntriesPageMock = getLibraryEntriesPage as jest.MockedFunction<
   typeof getLibraryEntriesPage
>;

const librarySearchParamsCacheMock = librarySearchParamsCache as DeepMockProxy<
   typeof librarySearchParamsCache
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
      case "f_models":
         return ["mod-1"];
      case "f_collectionIds":
         return ["col-id-1"];
      case "f_isFavorite":
         return "false";
   }
};

const assertRendered = () => {
   const dashboard = screen.getByTestId("library-dashboard");
   const createEntryBtn = screen.getByTestId("create-library-entry-btn");
   const toolbar = screen.getByTestId("library-toolbar");
   const entries = screen.getByTestId("library-entries-grid");

   assertInDocument(dashboard);
   assertInDocument(createEntryBtn);
   assertInDocument(toolbar);
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

   it("LibraryDashboard rendered test", async () => {
      librarySearchParamsCacheMock.get.mockImplementation(mockSearchParams);

      const categories = dtestData.dLibraryEntryCategories();
      const models = dtestData.dLibraryEntryModels();
      getLibraryCategoriesMock.mockResolvedValue(categories);
      getLibraryModelsMock.mockResolvedValue(models);

      const { container } = await renderAsyncRSC(LibraryDashboard, {});

      await waitFor(() => {
         assertRendered();
         expect(getLibraryCategoriesMock).toHaveBeenCalledTimes(1);
         expect(getLibraryModelsMock).toHaveBeenCalledTimes(1);
      });

      expect(container).toMatchSnapshot();
   });
});
