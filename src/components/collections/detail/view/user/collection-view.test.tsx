jest.mock("@/data/actions/collection");
jest.mock("@/data/actions/template");
jest.mock("@/components/templates/search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { templatesSearchParamsCache } from "@/components/templates/search-params";
import { getCollections } from "@/data/actions/collection";
import {
   getTemplateDescriptorCategories,
   getTemplateDescriptorModels,
   getTemplateDescriptorsPage,
} from "@/data/actions/template";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsPageQuery } from "@/data/types/domain/prompt";

import { CollectionView } from "./collection-view";

type CacheKey = Parameters<typeof templatesSearchParamsCache.get>[0];
type CacheValue = ReturnType<typeof templatesSearchParamsCache.get>;

const getCollectionsMock = getCollections as jest.MockedFunction<
   typeof getCollections
>;

const getTemplateDescriptorCategoriesMock =
   getTemplateDescriptorCategories as jest.MockedFunction<
      typeof getTemplateDescriptorCategories
   >;

const getTemplateDescriptorModelsMock =
   getTemplateDescriptorModels as jest.MockedFunction<
      typeof getTemplateDescriptorModels
   >;

const getTemplateDescriptorsPageMock =
   getTemplateDescriptorsPage as jest.MockedFunction<
      typeof getTemplateDescriptorsPage
   >;

const templatesSearchParamsCacheMock =
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
   const view = screen.getByTestId("collection-view");
   const header = screen.getByTestId("collection-header");
   const toolbar = screen.getByTestId("templates-toolbar");
   const items = screen.getByTestId("template-items-grid");

   assertInDocument(view);
   assertInDocument(header);
   assertInDocument(toolbar);
   assertInDocument(items);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DPromptsPageQuery
) => {
   expect(getTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
   expect(getTemplateDescriptorsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("CollectionView rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dTemplateDescriptorsPage();
      getTemplateDescriptorsPageMock.mockResolvedValue(page);
      getCollectionsMock.mockResolvedValue([]);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered - test", async () => {
      templatesSearchParamsCacheMock.get.mockImplementation(mockSearchParams);

      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();
      getTemplateDescriptorCategoriesMock.mockResolvedValue(categories);
      getTemplateDescriptorModelsMock.mockResolvedValue(models);

      const collection = dtestData.dCollection(1);

      const { container } = await renderAsyncRSC(CollectionView, {
         collection,
      });

      const expectedPayload: DPromptsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: {
            categories: mockSearchParams("f_categories"),
            models: mockSearchParams("f_models"),
            search: mockSearchParams("f_search"),
            collectionIds: [collection.id],
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
