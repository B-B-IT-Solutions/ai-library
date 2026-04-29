jest.mock("@/data/actions/template");

import {
   InfiniteData,
   QueryFunction,
   QueryFunctionContext,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";

import {
   getPromptTemplateCategories,
   getTemplateDescriptorsPage,
} from "@/data/actions/template";
import {
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";

import {
   infiniteLoadTemplateDescriptorsOptions,
   loadPromptTemplateCategoriesOptions,
   preloadPromptTemplateCategoriesOptions,
   useInfiniteLoadTemplateDescriptors,
   useLoadPromptTemplateCategories,
} from "./template";
import { LoadTemplateDescriptorsParams } from "./types";

const getTemplateDescriptorsPageMock =
   getTemplateDescriptorsPage as jest.MockedFunction<
      typeof getTemplateDescriptorsPage
   >;

const getPromptTemplateCategoriesMock =
   getPromptTemplateCategories as jest.MockedFunction<
      typeof getPromptTemplateCategories
   >;

describe("prefetch options tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test("preloadPromptTemplateCategoriesOptions  test", async () => {
      const categories = ["category 1", "category 2", "category 3"];
      getPromptTemplateCategoriesMock.mockResolvedValue(categories);

      const expectedOptions: UndefinedInitialDataOptions<
         string[],
         Error,
         string[]
      > = {
         queryKey: ["prompt-template-categories"],
         queryFn: jest.fn(),
      };

      const options = preloadPromptTemplateCategoriesOptions();
      const queryFn = options.queryFn as QueryFunction<string[]>;
      const context = {} as QueryFunctionContext;
      const fnResult = await queryFn(context);

      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(getPromptTemplateCategoriesMock).toHaveBeenCalledTimes(1);
      expect(fnResult).toEqual(categories);
   });
});

describe("loadTemplateDescriptors hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("infiniteLoadTemplateDescriptorsOptions - test", async () => {
      const filters = dtestData.dTemplateDescriptorsFilter();
      const sort = dtestData.sort();
      const params: LoadTemplateDescriptorsParams = { filters, sort };

      const expectedOptions: UndefinedInitialDataInfiniteOptions<
         DTemplateDescriptorsPage,
         Error,
         InfiniteData<DTemplateDescriptorsPage, unknown>,
         QueryKey,
         number
      > = {
         queryKey: ["templates", { filters, sort }],
         queryFn: jest.fn(),
         initialPageParam: 0,
         getNextPageParam: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = infiniteLoadTemplateDescriptorsOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useInfiniteLoadTemplateDescriptors test", async () => {
      const page = dtestData.dTemplateDescriptorsPage();
      getTemplateDescriptorsPageMock.mockResolvedValue(page);

      const filters = dtestData.dTemplateDescriptorsFilter();
      const sort = dtestData.sort();
      const params: LoadTemplateDescriptorsParams = { filters, sort };

      const { result } = renderHookWithReactQuery(() =>
         useInfiniteLoadTemplateDescriptors(params)
      );

      const expectedQuery: DTemplateDescriptorsPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: params.filters,
         sort: params.sort,
      };

      await waitFor(() => {
         expect(result.current.data?.pageParams).toEqual([0]);
         expect(result.current.data?.pages).toHaveLength(1);
         expect(result.current.data?.pages[0]).toEqual(page);
         expect(getTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
         expect(getTemplateDescriptorsPageMock).toHaveBeenCalledWith(
            expectedQuery
         );
      });
   });
});

describe("loadPromptTemplateCategories hooks tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test("loadPromptTemplateCategoriesOptions - test", async () => {
      const expectedOptions: UndefinedInitialDataOptions<
         string[],
         Error,
         string[]
      > = {
         queryKey: ["prompt-template-categories"],
         queryFn: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = loadPromptTemplateCategoriesOptions();
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useLoadPromptTemplateCategories test", async () => {
      const categories = ["category 1", "category 2", "category 3"];
      getPromptTemplateCategoriesMock.mockResolvedValue(categories);

      const { result } = renderHookWithReactQuery(() =>
         useLoadPromptTemplateCategories()
      );

      await waitFor(() => {
         expect(result.current.data).toEqual(categories);
         expect(getPromptTemplateCategoriesMock).toHaveBeenCalledTimes(1);
      });
   });
});
