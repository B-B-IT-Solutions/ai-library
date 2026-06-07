jest.mock("@/data/actions/collection");
jest.mock("@/data/actions/prompt");
jest.mock("./search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { getCollectionPreviews } from "@/data/actions/collection";
import {
   getPromptCategories,
   getPromptModels,
   getPromptsPage,
   getPromptsUsage,
} from "@/data/actions/prompt";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsUsage } from "@/data/types/domain/prompt";
import { DPromptsPageQuery } from "@/data/types/domain/prompt";

import { PromptsDashboard } from "./prompts-dashboard";
import { templatesSearchParamsCache } from "./search-params";

type CacheKey = Parameters<typeof templatesSearchParamsCache.get>[0];
type CacheValue = ReturnType<typeof templatesSearchParamsCache.get>;

const getPromptCategoriesMock = getPromptCategories as jest.MockedFunction<
   typeof getPromptCategories
>;

const getPromptModelsMock = getPromptModels as jest.MockedFunction<
   typeof getPromptModels
>;

const getCollectionPreviewsMock = getCollectionPreviews as jest.MockedFunction<
   typeof getCollectionPreviews
>;

const getPromptsPageMock = getPromptsPage as jest.MockedFunction<
   typeof getPromptsPage
>;

const getPromptsUsageMock = getPromptsUsage as jest.MockedFunction<
   typeof getPromptsUsage
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
   const dashboard = screen.getByTestId("prompts-dashboard");
   const createPromptBtn = screen.getByTestId("create-prompt-btn");
   const toolbar = screen.getByTestId("prompts-toolbar");
   const entries = screen.getByTestId("template-items-grid");

   assertInDocument(dashboard);
   assertInDocument(createPromptBtn);
   assertInDocument(toolbar);
   assertInDocument(entries);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DPromptsPageQuery
) => {
   expect(getPromptsPageMock).toHaveBeenCalledTimes(1);
   expect(getPromptsPageMock).toHaveBeenCalledWith(expectedPayload);
};

describe("PromptsDashboard rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dPromptsPage();
      getPromptsPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered test", async () => {
      templatesSearchParamsCacheMock.get.mockImplementation(mockSearchParams);

      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();
      const collectionPreviews = dtestData.dCollectionPreviews();
      getPromptCategoriesMock.mockResolvedValue(categories);
      getPromptModelsMock.mockResolvedValue(models);
      getCollectionPreviewsMock.mockResolvedValue(collectionPreviews);

      const usage: DPromptsUsage = {
         current: 3,
         limit: 50,
      };
      getPromptsUsageMock.mockResolvedValue(usage);

      const { container } = await renderAsyncRSC(PromptsDashboard, {});

      const expectedPayload: DPromptsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: {
            categories: mockSearchParams("f_categories"),
            models: mockSearchParams("f_models"),
            search: mockSearchParams("f_search"),
            collectionIds: ["col-id-1"],
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
         expect(getCollectionPreviewsMock).toHaveBeenCalledTimes(1);
         expect(getPromptsUsageMock).toHaveBeenCalledTimes(1);
         assertGetLibraryEntriesPageCalled(expectedPayload);
      });

      expect(container).toMatchSnapshot();
   });
});
