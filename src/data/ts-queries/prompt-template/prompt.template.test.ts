jest.mock("@/data/actions/prompt-template");

import {
   QueryFunction,
   QueryFunctionContext,
   UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";

import {
   getPromptTemplateCategories,
   getPromptTemplates,
} from "@/data/actions/prompt-template";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

import {
   loadPromptTemplateCategoriesOptions,
   loadPromptTemplatesOptions,
   preloadPromptTemplateCategoriesOptions,
   preloadPromptTemplatesOptions,
   useLoadPromptTemplateCategories,
   useLoadPromptTemplates,
} from "./prompt.template";
import { LoadPromptTemplatesParams } from "./types";

const getPromptTemplatesMock = getPromptTemplates as jest.MockedFunction<
   typeof getPromptTemplates
>;

const getPromptTemplateCategoriesMock =
   getPromptTemplateCategories as jest.MockedFunction<
      typeof getPromptTemplateCategories
   >;

describe("prefetch options tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test("preloadPromptTemplatesOptions  - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      getPromptTemplatesMock.mockResolvedValue(templates);

      const expectedOptions: UndefinedInitialDataOptions<
         string[],
         Error,
         string[]
      > = {
         queryKey: ["prompt-templates", {}],
         queryFn: jest.fn(),
      };

      const options = preloadPromptTemplatesOptions();
      const queryFn = options.queryFn as QueryFunction<
         DPromptTemplateDescriptor[]
      >;
      const context = {} as QueryFunctionContext;
      const fnResult = await queryFn(context);

      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(getPromptTemplatesMock).toHaveBeenCalledTimes(1);
      expect(fnResult).toEqual(templates);
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

describe("loadPromptTemplates hooks tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test("loadPromptTemplatesOptions - test", async () => {
      const params: LoadPromptTemplatesParams = {
         search: "test 1",
         categories: ["cat 123"],
      };
      const expectedOptions: UndefinedInitialDataOptions<
         DPromptTemplateDescriptor[],
         Error,
         DPromptTemplateDescriptor[]
      > = {
         queryKey: ["prompt-templates", { params }],
         queryFn: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = loadPromptTemplatesOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useLoadPromptTemplates test", async () => {
      const params: LoadPromptTemplatesParams = {
         search: "test 123",
         categories: ["cat 1"],
      };
      const templates = dtestData.dPromptTemplateDescriptors();
      getPromptTemplatesMock.mockResolvedValue(templates);

      const { result } = renderHookWithReactQuery(() =>
         useLoadPromptTemplates(params)
      );

      await waitFor(() => {
         expect(result.current.data).toEqual(templates);
         expect(getPromptTemplatesMock).toHaveBeenCalledTimes(1);
         expect(getPromptTemplatesMock).toHaveBeenCalledWith(params);
      });
   });
});
