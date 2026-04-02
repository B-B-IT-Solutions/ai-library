jest.mock("@/data/actions/library");
jest.mock("@/data/actions/prompt-template");
jest.mock("./search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import {
   getLibraryCategories,
   getLibraryCollections,
   getLibraryModels,
} from "@/data/actions/library";
import { getTemplateDescriptorsPage } from "@/data/actions/prompt-template";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DTemplateDescriptorsPageQuery } from "@/data/types/domain/prompt.template";

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

const getTemplateDescriptorsPageMock =
   getTemplateDescriptorsPage as jest.MockedFunction<
      typeof getTemplateDescriptorsPage
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

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DTemplateDescriptorsPageQuery
) => {
   expect(getTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
   expect(getTemplateDescriptorsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("LibraryDashboard rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dTemplateDescriptorsPage();

      getLibraryCollectionsMock.mockResolvedValue([]);
      getTemplateDescriptorsPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("LibraryDashboard rendered test", async () => {
      librarySearchParamsCacheMock.get.mockImplementation(mockSearchParams);

      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();
      getLibraryCategoriesMock.mockResolvedValue(categories);
      getLibraryModelsMock.mockResolvedValue(models);

      const { container } = await renderAsyncRSC(LibraryDashboard, {});

      const expectedPayload: DTemplateDescriptorsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: {
            categories: mockSearchParams("f_categories"),
            models: mockSearchParams("f_models"),
            search: mockSearchParams("f_search"),
         },
         sort: {
            field: "createdAt",
            order: "desc",
         },
      };

      await waitFor(() => {
         assertRendered();
         expect(getLibraryCategoriesMock).toHaveBeenCalledTimes(1);
         expect(getLibraryModelsMock).toHaveBeenCalledTimes(1);
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });
});
