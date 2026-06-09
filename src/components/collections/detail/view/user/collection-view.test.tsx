jest.mock("@/data/actions/collection");
jest.mock("@/data/actions/prompt");
jest.mock("@/components/prompts/search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { templatesSearchParamsCache } from "@/components/prompts/search-params";
import { getCollectionPreviews } from "@/data/actions/collection";
import {
   getPromptCategories,
   getPromptModels,
   getPromptsPage,
} from "@/data/actions/prompt";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsPageQuery } from "@/data/types/domain/prompt";

import { CollectionView } from "./collection-view";

type CacheKey = Parameters<typeof templatesSearchParamsCache.get>[0];
type CacheValue = ReturnType<typeof templatesSearchParamsCache.get>;

const getCollectionPreviewsMock = getCollectionPreviews as jest.MockedFunction<
   typeof getCollectionPreviews
>;

const getPromptCategoriesMock = getPromptCategories as jest.MockedFunction<
   typeof getPromptCategories
>;

const getPromptModelsMock = getPromptModels as jest.MockedFunction<
   typeof getPromptModels
>;

const getPromptsPageMock = getPromptsPage as jest.MockedFunction<
   typeof getPromptsPage
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
   const toolbar = screen.getByTestId("prompts-toolbar");
   const items = screen.getByTestId("prompt-items-grid");

   assertInDocument(view);
   assertInDocument(header);
   assertInDocument(toolbar);
   assertInDocument(items);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DPromptsPageQuery
) => {
   expect(getPromptsPageMock).toHaveBeenCalledTimes(1);
   expect(getPromptsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("CollectionView rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dPromptsPage();
      getPromptsPageMock.mockResolvedValue(page);
      getCollectionPreviewsMock.mockResolvedValue([]);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered - test", async () => {
      templatesSearchParamsCacheMock.get.mockImplementation(mockSearchParams);

      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();
      getPromptCategoriesMock.mockResolvedValue(categories);
      getPromptModelsMock.mockResolvedValue(models);

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
         expect(getPromptCategoriesMock).toHaveBeenCalledTimes(1);
         expect(getPromptModelsMock).toHaveBeenCalledTimes(1);
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });
});
