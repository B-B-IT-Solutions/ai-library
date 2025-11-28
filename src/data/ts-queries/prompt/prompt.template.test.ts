jest.mock("@/data/actions/prompt/prompt.template.actions");

import { UndefinedInitialDataOptions } from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";

import {
   getPromptTemplateCategories,
   getPromptTemplates,
} from "@/data/actions/prompt/prompt.template.actions";
import { DPromptTemplate } from "@/data/types/domain/prompt";

import {
   loadPromptTemplatesOptions,
   useLoadPromptTemplates,
} from "./prompt.template";

const getPromptTemplatesMock = getPromptTemplates as jest.MockedFunction<
   typeof getPromptTemplates
>;

describe("loadPromptTemplatesOptions hooks tests", () => {
   test("loadPromptTemplatesOptions - test", async () => {
      const expectedOptions: UndefinedInitialDataOptions<
         DPromptTemplate[],
         Error,
         DPromptTemplate[]
      > = {
         queryKey: ["prompt-templates"],
         queryFn: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = loadPromptTemplatesOptions();
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useLoadPromptTemplates test", async () => {
      const templates = dtestData.dPromptTemplates();
      getPromptTemplatesMock.mockResolvedValue(templates);

      const { result } = renderHookWithReactQuery(() =>
         useLoadPromptTemplates()
      );

      await waitFor(() => {
         expect(result.current.data).toEqual(templates);
         expect(getPromptTemplatesMock).toHaveBeenCalledTimes(1);
      });
   });
});
