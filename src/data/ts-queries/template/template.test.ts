jest.mock("@/data/actions/prompt-template");

import {
   QueryFunction,
   QueryFunctionContext,
   UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { renderHookWithReactQuery } from "@tests";

import { getPromptTemplateCategories } from "@/data/actions/prompt-template";

import {
   loadPromptTemplateCategoriesOptions,
   preloadPromptTemplateCategoriesOptions,
   useLoadPromptTemplateCategories,
} from "./template";

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
