jest.mock("@/data/repositories/prompt/prompt.template");

import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   getPromptTemplateCategories as pGetPromptTemplateCategories,
   getPromptTemplates as pGetPromptTemplates,
} from "@/data/repositories/prompt/prompt.template";

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

   it("getPromptTemplates - params undefined - test", async () => {
      const templates = ptestData.pPromptTemplatesWithCategories();
      pGetPromptTemplatesMock.mockResolvedValue(templates);

      const result = await getPromptTemplates();
      const expectedResult = toDPromptTemplates(templates);

      expect(result).toEqual(expectedResult);
      expect(pGetPromptTemplatesMock).toHaveBeenCalledTimes(1);
      expect(pGetPromptTemplatesMock).toHaveBeenCalledWith(undefined);
   });

   it("getPromptTemplates - params empty - test", async () => {
      const templates = ptestData.pPromptTemplatesWithCategories();
      pGetPromptTemplatesMock.mockResolvedValue(templates);

      const result = await getPromptTemplates({});
      const expectedResult = toDPromptTemplates(templates);

      expect(result).toEqual(expectedResult);
      expect(pGetPromptTemplatesMock).toHaveBeenCalledTimes(1);
      expect(pGetPromptTemplatesMock).toHaveBeenCalledWith({});
   });

   it("getPromptTemplates - params defined - test", async () => {
      const templates = ptestData.pPromptTemplatesWithCategories();
      pGetPromptTemplatesMock.mockResolvedValue(templates);

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const params = { search, categories };

      const result = await getPromptTemplates(params);
      const expectedResult = toDPromptTemplates(templates);

      expect(result).toEqual(expectedResult);
      expect(pGetPromptTemplatesMock).toHaveBeenCalledTimes(1);
      expect(pGetPromptTemplatesMock).toHaveBeenCalledWith(params);
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
