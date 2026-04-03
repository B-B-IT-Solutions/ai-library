jest.mock("@/data/actions/collections");
jest.mock("@/data/actions/prompt-template");
jest.mock("./search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { getLibraryCollections } from "@/data/actions/collections";
import {
   getTemplateDescriptorCategories,
   getTemplateDescriptorModels,
   getTemplateDescriptorsPage,
} from "@/data/actions/prompt-template";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DTemplateDescriptorsPageQuery } from "@/data/types/domain/prompt.template";

import { templatesSearchParamsCache } from "./search-params";
import { TemplatesDashboard } from "./templates-dashboard";

type CacheKey = Parameters<typeof templatesSearchParamsCache.get>[0];
type CacheValue = ReturnType<typeof templatesSearchParamsCache.get>;

const getTemplateDescriptorCategoriesMock =
   getTemplateDescriptorCategories as jest.MockedFunction<
      typeof getTemplateDescriptorCategories
   >;

const getTemplateDescriptorModelsMock =
   getTemplateDescriptorModels as jest.MockedFunction<
      typeof getTemplateDescriptorModels
   >;

const getLibraryCollectionsMock = getLibraryCollections as jest.MockedFunction<
   typeof getLibraryCollections
>;

const getTemplateDescriptorsPageMock =
   getTemplateDescriptorsPage as jest.MockedFunction<
      typeof getTemplateDescriptorsPage
   >;

const librarySearchParamsCacheMock =
   templatesSearchParamsCache as DeepMockProxy<
      typeof templatesSearchParamsCache
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
   const dashboard = screen.getByTestId("templates-dashboard");
   const createTemplateBtn = screen.getByTestId("create-template-btn");
   const toolbar = screen.getByTestId("templates-toolbar");
   const entries = screen.getByTestId("template-items-grid");

   assertInDocument(dashboard);
   assertInDocument(createTemplateBtn);
   assertInDocument(toolbar);
   assertInDocument(entries);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DTemplateDescriptorsPageQuery
) => {
   expect(getTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
   expect(getTemplateDescriptorsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("TemplatesDashboard rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dTemplateDescriptorsPage();

      getLibraryCollectionsMock.mockResolvedValue([]);
      getTemplateDescriptorsPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered test", async () => {
      librarySearchParamsCacheMock.get.mockImplementation(mockSearchParams);

      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();
      getTemplateDescriptorCategoriesMock.mockResolvedValue(categories);
      getTemplateDescriptorModelsMock.mockResolvedValue(models);

      const { container } = await renderAsyncRSC(TemplatesDashboard, {});

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
         expect(getTemplateDescriptorCategoriesMock).toHaveBeenCalledTimes(1);
         expect(getTemplateDescriptorModelsMock).toHaveBeenCalledTimes(1);
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });
});
