jest.mock("@/data/db/queries/prompt.template");

import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   getPromptTemplateCategories as pGetPromptTemplateCategories,
   getPromptTemplates as pGetPromptTemplates,
} from "@/data/db/queries/prompt.template";

import { toDPromptTemplates } from "./prompt.mapper";
import {
   getPromptTemplateCategories,
   getPromptTemplates,
} from "./prompt.template.actions";

const pGetPromptTemplatesMock = pGetPromptTemplates as jest.MockedFunction<
   typeof pGetPromptTemplates
>;

const pGetPromptTemplateCategoriesMock =
   pGetPromptTemplateCategories as jest.MockedFunction<
      typeof pGetPromptTemplateCategories
   >;

describe("getPromptTemplates tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPromptTemplates test", async () => {
      const templates = ptestData.pPromptTemplatesWithCategories();
      pGetPromptTemplatesMock.mockResolvedValue(templates);

      const result = await getPromptTemplates();
      const expectedResult = toDPromptTemplates(templates);

      expect(result).toEqual(expectedResult);
      expect(pGetPromptTemplatesMock).toHaveBeenCalledTimes(1);
   });
});

describe("getAllPromptTemplateCategories tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPromptTemplateCategories test", async () => {
      const categories = ptestData.pPromptTemplateCategories();
      pGetPromptTemplateCategoriesMock.mockResolvedValue(categories);

      const result = await getPromptTemplateCategories();
      const expectedResult = map(categories, (c) => c.name);

      expect(result).toEqual(expectedResult);
      expect(pGetPromptTemplateCategoriesMock).toHaveBeenCalledTimes(1);
   });
});
