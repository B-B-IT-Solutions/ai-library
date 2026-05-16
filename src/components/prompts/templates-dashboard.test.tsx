jest.mock("@/data/actions/collection");
jest.mock("@/data/actions/prompt");
jest.mock("./search-params");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { getCollections } from "@/data/actions/collection";
import {
   getTemplateDescriptorCategories,
   getTemplateDescriptorModels,
   getTemplateDescriptorsPage,
   getTemplateUsage,
} from "@/data/actions/prompt";
import { DTemplateUsage } from "@/data/types/domain/prompt";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";
import { DPromptsPageQuery } from "@/data/types/domain/prompt";

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

const getCollectionsMock = getCollections as jest.MockedFunction<
   typeof getCollections
>;

const getTemplateDescriptorsPageMock =
   getTemplateDescriptorsPage as jest.MockedFunction<
      typeof getTemplateDescriptorsPage
   >;

const getTemplateUsageMock = getTemplateUsage as jest.MockedFunction<
   typeof getTemplateUsage
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
   const dashboard = screen.getByTestId("templates-dashboard");
   const createTemplateBtn = screen.getByTestId("create-template-btn");
   const usageIndicator = screen.getByTestId("template-usage-indicator");
   const toolbar = screen.getByTestId("templates-toolbar");
   const entries = screen.getByTestId("template-items-grid");

   assertInDocument(dashboard);
   assertInDocument(createTemplateBtn);
   assertInDocument(usageIndicator);
   assertInDocument(toolbar);
   assertInDocument(entries);
};

const assertGetLibraryEntriesPageCalled = (
   expectedPayload: DPromptsPageQuery
) => {
   expect(getTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
   expect(getTemplateDescriptorsPageMock).toHaveBeenCalledWith(expectedPayload);
};

const defaultUsage: DTemplateUsage = { current: 3, limit: 50 };

describe("TemplatesDashboard rendering tests", () => {
   beforeAll(() => {
      const page = dtestData.dPromptsPage();

      getCollectionsMock.mockResolvedValue([]);
      getTemplateDescriptorsPageMock.mockResolvedValue(page);
      getTemplateUsageMock.mockResolvedValue(defaultUsage);
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered test", async () => {
      templatesSearchParamsCacheMock.get.mockImplementation(mockSearchParams);

      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();
      getTemplateDescriptorCategoriesMock.mockResolvedValue(categories);
      getTemplateDescriptorModelsMock.mockResolvedValue(models);

      const { container } = await renderAsyncRSC(TemplatesDashboard, {});

      const expectedPayload: DPromptsPageQuery = {
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

   it("usage indicator shows count / limit - test", async () => {
      templatesSearchParamsCacheMock.get.mockImplementation(mockSearchParams);
      getTemplateDescriptorCategoriesMock.mockResolvedValue([]);
      getTemplateDescriptorModelsMock.mockResolvedValue([]);
      getTemplateUsageMock.mockResolvedValue({ current: 12, limit: 50 });

      await renderAsyncRSC(TemplatesDashboard, {});

      await waitFor(() => {
         const indicator = screen.getByTestId("template-usage-indicator");
         assertInDocument(indicator);
         expect(indicator.textContent).toContain("12");
         expect(indicator.textContent).toContain("50");
      });
   });

   it("usage indicator shows count only when unlimited - test", async () => {
      templatesSearchParamsCacheMock.get.mockImplementation(mockSearchParams);
      getTemplateDescriptorCategoriesMock.mockResolvedValue([]);
      getTemplateDescriptorModelsMock.mockResolvedValue([]);
      getTemplateUsageMock.mockResolvedValue({ current: 500, limit: -1 });

      await renderAsyncRSC(TemplatesDashboard, {});

      await waitFor(() => {
         const indicator = screen.getByTestId("template-usage-indicator");
         expect(indicator.textContent).toContain("500");
         expect(indicator.textContent).not.toContain("/ -1");
      });
   });

   it("create button disabled when at limit - test", async () => {
      templatesSearchParamsCacheMock.get.mockImplementation(mockSearchParams);
      getTemplateDescriptorCategoriesMock.mockResolvedValue([]);
      getTemplateDescriptorModelsMock.mockResolvedValue([]);
      getTemplateUsageMock.mockResolvedValue({ current: 5, limit: 5 });

      await renderAsyncRSC(TemplatesDashboard, {});

      await waitFor(() => {
         const btn = screen.getByTestId("create-template-btn");
         expect(btn).toBeDisabled();
      });
   });
});
