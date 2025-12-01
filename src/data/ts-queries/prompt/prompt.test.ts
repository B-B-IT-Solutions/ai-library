jest.mock("@/data/actions/prompt/prompt.actions");

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
   getPromptCategories,
   getPrompts,
} from "@/data/actions/prompt/prompt.actions";
import { DPromptsPage, DPromptsPageQuery } from "@/data/types/domain/prompt";

import {
   infiniteLoadPromptsOptions,
   loadPromptCategoriesOptions,
   preloadPromptCategoriesOptions,
   preloadPromptsOptions,
   useInfiniteLoadPrompts,
   useLoadPromptCategories,
} from "./prompt";
import { LoadPromptsParams } from "./types";

const getPromptsMock = getPrompts as jest.MockedFunction<typeof getPrompts>;
const getPromptCategoriesMock = getPromptCategories as jest.MockedFunction<
   typeof getPromptCategories
>;

describe("prefetch options tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test("preloadPromptsOptions  - test", async () => {
      const page = dtestData.dPromptsPage();
      getPromptsMock.mockResolvedValue(page);

      const expectedOptions: UndefinedInitialDataOptions<
         string[],
         Error,
         string[]
      > = {
         queryKey: ["prompts", {}],
         queryFn: jest.fn(),
      };

      const options = preloadPromptsOptions();
      const queryFn = options.queryFn as QueryFunction<DPromptsPage>;
      const context = {} as QueryFunctionContext;
      const fnResult = await queryFn(context);

      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(getPromptsMock).toHaveBeenCalledTimes(1);
      expect(fnResult).toEqual(page);
   });

   test("preloadPromptCategoriesOptions  test", async () => {
      const categories = ["category 1", "category 2", "category 3"];
      getPromptCategoriesMock.mockResolvedValue(categories);

      const expectedOptions: UndefinedInitialDataOptions<
         string[],
         Error,
         string[]
      > = {
         queryKey: ["prompt-categories"],
         queryFn: jest.fn(),
      };

      const options = preloadPromptCategoriesOptions();
      const queryFn = options.queryFn as QueryFunction<string[]>;
      const context = {} as QueryFunctionContext;
      const fnResult = await queryFn(context);

      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(getPromptCategoriesMock).toHaveBeenCalledTimes(1);
      expect(fnResult).toEqual(categories);
   });
});

describe("loadPrompts hooks tests", () => {
   test("infiniteLoadPromptsOptions - test", async () => {
      const filter = dtestData.dPromptsFilter();
      const params: LoadPromptsParams = {
         search: "test 1",
         categories: filter.categories,
      };

      const expectedOptions: UndefinedInitialDataInfiniteOptions<
         DPromptsPage,
         Error,
         InfiniteData<DPromptsPage, unknown>,
         QueryKey,
         number
      > = {
         queryKey: ["prompts", { params }],
         queryFn: jest.fn(),
         initialPageParam: 0,
         getNextPageParam: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = infiniteLoadPromptsOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useInfiniteLoadPrompts test", async () => {
      const promptsPage = dtestData.dPromptsPage();
      getPromptsMock.mockResolvedValue(promptsPage);
      const filter = dtestData.dPromptsFilter();
      const params: LoadPromptsParams = {
         search: "test 1",
         categories: filter.categories,
      };

      const { result } = renderHookWithReactQuery(() =>
         useInfiniteLoadPrompts(params)
      );

      const expectedQuery: DPromptsPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         globalFilter: params.search,
         filter: filter,
      };

      await waitFor(() => {
         expect(result.current.data?.pageParams).toEqual([0]);
         expect(result.current.data?.pages).toHaveLength(1);
         expect(result.current.data?.pages[0]).toEqual(promptsPage);
         expect(getPromptsMock).toHaveBeenCalledTimes(1);
         expect(getPromptsMock).toHaveBeenCalledWith(expectedQuery);
      });
   });
});

describe("loadPromptCategories hooks tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test("loadPromptCategoriesOptions - test", async () => {
      const expectedOptions: UndefinedInitialDataOptions<
         string[],
         Error,
         string[]
      > = {
         queryKey: ["prompt-categories"],
         queryFn: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = loadPromptCategoriesOptions();
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useLoadPromptCategories test", async () => {
      const categories = ["category 1", "category 2", "category 3"];
      getPromptCategoriesMock.mockResolvedValue(categories);

      const { result } = renderHookWithReactQuery(() =>
         useLoadPromptCategories()
      );

      await waitFor(() => {
         expect(result.current.data).toEqual(categories);
         expect(getPromptCategoriesMock).toHaveBeenCalledTimes(1);
      });
   });
});
