jest.mock("@/data/repositories/prompt/prompt.template");

import { ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PromptTemplateRepository } from "@/data/repositories/prompt/prompt.template";

import {
   toDPromptTemplateDescriptors,
   toDPromptTemplateDescriptorWithTemplate,
} from "./prompt.template.mapper";
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

      const result =
         await promptTemplateService.getPromptTemplateDescriptors(params);
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

describe("getPromptTemplateDescriptorWithTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPromptTemplateDescriptorWithTemplate - descriptor not found - test", async () => {
      promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         null
      );

      const id = "prompt-descriptor-id-1";
      const result =
         await promptTemplateService.getPromptTemplateDescriptorWithTemplate(
            id
         );

      expect(result).toBeNull();
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(id);
   });

   it("getPromptTemplateDescriptorWithTemplate - descriptor retrieved - test", async () => {
      const promptDescriptor = ptestData.pPromptTemplateDescriptorWithPrompt();
      promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate.mockResolvedValue(
         promptDescriptor
      );

      const { id } = promptDescriptor;
      const result =
         await promptTemplateService.getPromptTemplateDescriptorWithTemplate(
            id
         );

      const expectedResult =
         toDPromptTemplateDescriptorWithTemplate(promptDescriptor);

      expect(result).toEqual(expectedResult);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledTimes(1);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateDescriptorWithTemplate
      ).toHaveBeenCalledWith(id);
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

      expect(result).toEqual(categories);
      expect(
         promptTemplateRepoMock.pGetPromptTemplateCategories
      ).toHaveBeenCalledTimes(1);
   });
});
