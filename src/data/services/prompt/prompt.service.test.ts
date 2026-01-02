jest.mock("@/data/repositories/prompt");

import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PromptRepository } from "@/data/repositories/prompt";
import { DPromptDescriptorsPageQuery } from "@/data/types/domain/prompt";
import { PromptCreateInput } from "@/generated/prisma/models";

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
      const prompt = dtestData.dPromptCreate();
      promptRepoMock.pCreatePrompt.mockRejectedValue(new Error("db error"));

      await expect(promptService.createPrompt(prompt)).rejects.toThrow(
         "db error"
      );

      const promptToSave: PromptCreateInput = {
         content: prompt.content,
         descriptor: {
            create: {
               title: prompt.title,
               recommendedModel: prompt.recommendedModel,
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
            },
         },
      };

      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledWith(promptToSave);
   });

   it("createPrompt - prompt created  - test", async () => {
      const prompt = dtestData.dPromptCreate();

      await promptService.createPrompt(prompt);

      const promptToSave: PromptCreateInput = {
         content: prompt.content,
         descriptor: {
            create: {
               title: prompt.title,
               recommendedModel: prompt.recommendedModel,
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
            },
         },
      };

      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledWith(promptToSave);
   });
});
