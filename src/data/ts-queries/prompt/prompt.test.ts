jest.mock("@/data/actions/prompt");

import {
   InfiniteData,
   QueryFunction,
   QueryFunctionContext,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   UndefinedInitialDataOptions,
   UseMutationOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";

import {
   getPromptsPage,
   getPromptTemplateCategories,
   togglePromptFavorite,
} from "@/data/actions/prompt";
import { DPromptsPage, DPromptsPageQuery } from "@/data/types/domain/prompt";
import { ActionResult } from "@/data/types/utils";

import {
   infiniteLoadPromptsPageOptions,
   loadPromptTemplateCategoriesOptions,
   preloadPromptTemplateCategoriesOptions,
   toggleFavoriteOptions,
   useInfiniteLoadPromptsPage,
   useLoadPromptTemplateCategories,
   useToggleFavorite,
} from "./prompt";
import { LoadTemplateDescriptorsParams, UpdateIsFavoriteParams } from "./types";

const getPromptsPageMock = getPromptsPage as jest.MockedFunction<
   typeof getPromptsPage
>;

const getPromptTemplateCategoriesMock =
   getPromptTemplateCategories as jest.MockedFunction<
      typeof getPromptTemplateCategories
   >;

const togglePromptFavoriteMock = togglePromptFavorite as jest.MockedFunction<
   typeof togglePromptFavorite
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

describe("loadPromptsPage hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("infiniteLoadPromptsPageOptions - test", async () => {
      const filters = dtestData.dPromptsFilter();
      const sort = dtestData.sort();
      const params: LoadTemplateDescriptorsParams = { filters, sort };

      const expectedOptions: UndefinedInitialDataInfiniteOptions<
         DPromptsPage,
         Error,
         InfiniteData<DPromptsPage, unknown>,
         QueryKey,
         number
      > = {
         queryKey: ["templates", { filters, sort }],
         queryFn: jest.fn(),
         initialPageParam: 0,
         getNextPageParam: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = infiniteLoadPromptsPageOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useInfiniteLoadPromptsPage test", async () => {
      const page = dtestData.dPromptsPage();
      getPromptsPageMock.mockResolvedValue(page);

      const filters = dtestData.dPromptsFilter();
      const sort = dtestData.sort();
      const params: LoadTemplateDescriptorsParams = { filters, sort };

      const { result } = renderHookWithReactQuery(() =>
         useInfiniteLoadPromptsPage(params)
      );

      const expectedQuery: DPromptsPageQuery = {
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
         expect(getPromptsPageMock).toHaveBeenCalledTimes(1);
         expect(getPromptsPageMock).toHaveBeenCalledWith(expectedQuery);
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

describe("toggleFavorite hooks tests", () => {
   test("toggleFavoriteOptions test", async () => {
      const expectedOptions: UseMutationOptions<
         ActionResult,
         Error,
         UpdateIsFavoriteParams
      > = {
         mutationFn: jest.fn(),
         onSuccess: jest.fn(),
      };

      const options = toggleFavoriteOptions();
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useToggleFavorite test", async () => {
      const { result } = renderHookWithReactQuery(() => useToggleFavorite());

      const params: UpdateIsFavoriteParams = {
         descriptorId: "1",
         isFavorite: true,
      };

      await waitFor(() => {
         result.current.mutate(params);
         expect(result.current.isSuccess).toBe(true);
         expect(togglePromptFavoriteMock).toHaveBeenCalledTimes(1);
         expect(togglePromptFavoriteMock).toHaveBeenCalledWith(
            params.descriptorId,
            params.isFavorite
         );
      });
   });
});
