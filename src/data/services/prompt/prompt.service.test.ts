jest.mock("@/data/repositories/prompt");

import { dtestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PromptRepository } from "@/data/repositories/prompt";
import { DPromptDescriptorsPageQuery } from "@/data/types/domain/prompt";
import { PromptDescriptorCreateInput } from "@/generated/prisma/models";

import { toDPromptDescriptor, toDPromptDescriptorsPage } from "./prompt.mapper";
import { PromptService } from "./prompt.service";

const promptRepo = new PromptRepository(prisma);
const promptRepoMock = promptRepo as DeepMockProxy<PromptRepository>;

const promptService = new PromptService(promptRepoMock);

describe("getPromptss tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPrompts - query undefined - test", async () => {
      const page = ptestData.pPromptDescriptorsPage();
      promptRepoMock.pGetPromptDescriptors.mockResolvedValue(page);

      const result = await promptService.getPrompts();
      const expectedResult = toDPromptDescriptorsPage(page);

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledWith(
         undefined
      );
   });

   it("getPrompts - query empty - test", async () => {
      const page = ptestData.pPromptDescriptorsPage();
      promptRepoMock.pGetPromptDescriptors.mockResolvedValue(page);

      const query: DPromptDescriptorsPageQuery = {};
      const result = await promptService.getPrompts(query);
      const expectedResult = toDPromptDescriptorsPage(page);

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledWith(query);
   });

   it("getPrompts - query defined - test", async () => {
      const page = ptestData.pPromptDescriptorsPage();
      promptRepoMock.pGetPromptDescriptors.mockResolvedValue(page);

      const query = dtestData.dPromptsPageQuery();
      const result = await promptService.getPrompts(query);
      const expectedResult = toDPromptDescriptorsPage(page);

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledWith(query);
   });
});

describe("getPromptCategories tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPromptCategories test", async () => {
      const categories = ptestData.pPromptCategories();
      promptRepoMock.pGetPromptCategories.mockResolvedValue(categories);

      const result = await promptService.getPromptCategories();

      expect(result).toEqual(categories);
      expect(promptRepoMock.pGetPromptCategories).toHaveBeenCalledTimes(1);
   });
});

describe("getPrompt tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getPrompt  - id invalid - test", async () => {
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(null);

      const id = "new";
      const result = await promptService.getPrompt(id);

      expect(result).toBeUndefined();
      expect(promptRepoMock.pGetPromptDescriptor).not.toHaveBeenCalled();
   });

   it("getPrompt  - promt undefined - test", async () => {
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(null);

      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await promptService.getPrompt(id);

      expect(result).toBeUndefined();
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledWith({ id });
   });

   it("getPrompt  - product defined - test", async () => {
      const prompt = ptestData.pPromptDescriptorWithCategories();
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(prompt);

      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await promptService.getPrompt(id);
      const expectedResult = toDPromptDescriptor(prompt);

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledWith({ id });
   });
});

describe("createPrompt tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("createPrompt - error - test", async () => {
      const prompt = dtestData.dPromptUpdate();
      promptRepoMock.pCreatePrompt.mockRejectedValue(new Error("db error"));

      await expect(promptService.createPrompt(prompt)).rejects.toThrow(
         "db error"
      );

      const promptToSave: PromptDescriptorCreateInput = {
         title: prompt.title,
         content: prompt.content,
         recommendedModel: prompt.recommendedModel,
         currentVersion: 1,
         categories: {
            connectOrCreate: [
               {
                  where: {
                     name: "category 1",
                  },
                  create: {
                     name: "category 1",
                  },
               },
            ],
         },
         followUpPrompts: {
            create: [
               {
                  content: "prompt follow up 0",
                  order: 0,
               },
               {
                  content: "prompt follow up 1",
                  order: 1,
               },
               {
                  content: "prompt follow up 2",
                  order: 2,
               },
            ],
         },
         versions: {
            create: {
               version: 1,
               content: prompt.content,
               title: prompt.title,
               categories: prompt.categories,
            },
         },
      };

      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledWith(promptToSave);
   });

   it("createPrompt - prompt created  - test", async () => {
      const prompt = dtestData.dPromptUpdate();

      await promptService.createPrompt(prompt);

      const promptToSave: PromptDescriptorCreateInput = {
         title: prompt.title,
         content: prompt.content,
         recommendedModel: prompt.recommendedModel,
         currentVersion: 1,
         categories: {
            connectOrCreate: [
               {
                  where: {
                     name: "category 1",
                  },
                  create: {
                     name: "category 1",
                  },
               },
            ],
         },
         followUpPrompts: {
            create: [
               {
                  content: "prompt follow up 0",
                  order: 0,
               },
               {
                  content: "prompt follow up 1",
                  order: 1,
               },
               {
                  content: "prompt follow up 2",
                  order: 2,
               },
            ],
         },
         versions: {
            create: {
               version: 1,
               content: prompt.content,
               title: prompt.title,
               categories: prompt.categories,
            },
         },
      };

      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledWith(promptToSave);
   });
});
