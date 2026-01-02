jest.mock("@/data/services/prompt");

import { dtestData } from "@tests";
import { map } from "es-toolkit/compat";

import { PromptTemplateService } from "@/data/services/prompt";

import {
   getPromptTemplateCategories,
   getPromptTemplates,
} from "./prompt.template.actions";

const sGetPromptTemplateDescriptors =
   PromptTemplateService.prototype.getPromptTemplateDescriptors;
const sGetPromptTemplateCategories =
   PromptTemplateService.prototype.getPromptTemplateCategories;

const sGetPromptTemplateDescriptorsMock =
   sGetPromptTemplateDescriptors as jest.MockedFunction<
      typeof sGetPromptTemplateDescriptors
   >;

const sGetPromptTemplateCategoriesMock =
   sGetPromptTemplateCategories as jest.MockedFunction<
      typeof sGetPromptTemplateCategories
   >;

describe("getPromptTemplates tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPromptTemplates - params undefined - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      sGetPromptTemplateDescriptorsMock.mockResolvedValue(templates);

      const result = await getPromptTemplates();

      expect(result).toEqual(templates);
      expect(sGetPromptTemplateDescriptorsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateDescriptorsMock).toHaveBeenCalledWith(undefined);
   });

   it("getPromptTemplates - params empty - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      sGetPromptTemplateDescriptorsMock.mockResolvedValue(templates);

      const result = await getPromptTemplates({});

      expect(result).toEqual(templates);
      expect(sGetPromptTemplateDescriptorsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateDescriptorsMock).toHaveBeenCalledWith({});
   });

   it("getPromptTemplates - params defined - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors();
      sGetPromptTemplateDescriptorsMock.mockResolvedValue(templates);

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const params = { search, categories };

      const result = await getPromptTemplates(params);

      expect(result).toEqual(templates);
      expect(sGetPromptTemplateDescriptorsMock).toHaveBeenCalledTimes(1);
      expect(sGetPromptTemplateDescriptorsMock).toHaveBeenCalledWith(params);
   });
});

describe("getPromptTemplateCategories tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPromptTemplateCategories test", async () => {
      const categories = dtestData.dPromptTemplateCategories();
      sGetPromptTemplateCategoriesMock.mockResolvedValue(categories);

      const result = await getPromptTemplateCategories();
      const expectedResult = map(categories, (c) => c.name);

      expect(result).toEqual(expectedResult);
      expect(sGetPromptTemplateCategoriesMock).toHaveBeenCalledTimes(1);
   });
});
