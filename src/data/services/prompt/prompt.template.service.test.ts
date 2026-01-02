jest.mock("@/data/repositories/prompt/prompt.template");

import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PromptTemplateRepository } from "@/data/repositories/prompt/prompt.template";

import { toDPromptTemplateDescriptors } from "./prompt.mapper";
import { PromptTemplateService } from "./prompt.template.service";

const promptTemplateRepo = new PromptTemplateRepository(prisma);
const promptTemplateRepoMock =
   promptTemplateRepo as DeepMockProxy<PromptTemplateRepository>;

const promptTemplateService = new PromptTemplateService(promptTemplateRepoMock);

describe("getPromptTemplateDescriptors tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPromptTemplateDescriptors - params undefined - test", async () => {
      const templates = ptestData.pPromptTemplateDescriptorsWithCategories();
      promptTemplateRepoMock.pGetPromptTemplateDescriptors.mockResolvedValue(
         templates
      );

      const result = await promptTemplateService.getPromptTemplateDescriptors();
      const expectedResult = toDPromptTemplateDescriptors(templates);

      expect(result).toEqual(expectedResult);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledWith(undefined);
   });

   it("getPromptTemplateDescriptors - params empty - test", async () => {
      const templates = ptestData.pPromptTemplateDescriptorsWithCategories();
      promptTemplateRepoMock.pGetPromptTemplateDescriptors.mockResolvedValue(
         templates
      );

      const result = await promptTemplateService.getPromptTemplateDescriptors(
         {}
      );
      const expectedResult = toDPromptTemplateDescriptors(templates);

      expect(result).toEqual(expectedResult);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledWith({});
   });

   it("getPromptTemplateDescriptors - params defined - test", async () => {
      const templates = ptestData.pPromptTemplateDescriptorsWithCategories();
      promptTemplateRepoMock.pGetPromptTemplateDescriptors.mockResolvedValue(
         templates
      );

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const params = { search, categories };

      const result = await promptTemplateService.getPromptTemplateDescriptors(
         params
      );
      const expectedResult = toDPromptTemplateDescriptors(templates);

      expect(result).toEqual(expectedResult);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptors
      ).toHaveBeenCalledWith(params);
   });
});

describe("getPromptTemplateCategories tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPromptTemplateCategories test", async () => {
      const categories = ptestData.pPromptTemplateCategories();
      promptTemplateRepoMock.pGetPromptTemplateCategories.mockResolvedValue(
         categories
      );

      const result = await promptTemplateService.getPromptTemplateCategories();
      const expectedResult = map(categories, (c) => c.name);

      expect(result).toEqual(expectedResult);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateCategories
      ).toHaveBeenCalledTimes(1);
   });
});
