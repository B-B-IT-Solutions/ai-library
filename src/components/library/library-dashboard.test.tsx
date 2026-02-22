jest.mock("@/data/actions/library");
jest.mock("./search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderRSC, resolveRSC } from "@tests";
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

const assertRendered = () => {
   const dashboard = screen.getByTestId("library-dashboard");
   assertInDocument(dashboard);
};

describe("LibraryDashboard rendering tests", () => {
   beforeEach(() => {
      const categories = ["cat-1", "cat-2", "cat-3"];
      const models = ["mod-1", "mod-2", "mod-3"];

      getLibraryCategoriesMock.mockResolvedValue(categories);
      getLibraryModelsMock.mockResolvedValue(models);
      getLibraryCollectionsMock.mockResolvedValue([]);
      getLibraryEntriesPageMock.mockResolvedValue({
         content: [],
         pageNumber: 1,
         pageSize: 20,
         totalPages: 0,
         totalEntries: 0,
      });
   });

   it("LibraryDashboard - viewMode grid - rendered test", async () => {
      librarySearchParamsCacheMock.get.mockImplementation((key: CacheKey) => {
         switch (key) {
            case "view":
               return DListViewMode.GRID;
            case "group":
               return DListGroupByMode.NONE;
            case "sort":
               return DListSortByMode.DATE_DESC;
            case "f_search":
               return "";
            case "f_categories":
            case "f_models":
            case "f_collectionIds":
               return [] as string[];
            case "f_isFavorite":
               return "false";
         }
      });
      const Component = await resolveRSC(LibraryDashboard, {});
      const { container } = renderRSC(Component);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryDashboard - viewMode list - rendered test", async () => {
      const Dashboard = await resolveRSC(LibraryDashboard, {});
      const { container } = renderRSC(Dashboard);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
