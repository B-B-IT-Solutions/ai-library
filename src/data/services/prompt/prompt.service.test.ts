jest.mock("@/data/repositories/prompt");

import { dtestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PromptRepository } from "@/data/repositories/prompt";
import {
   toDPromptDescriptor,
   toDPromptDescriptorsPage,
} from "@/data/repositories/prompt/prompt.mapper";
import { DPromptDescriptorsPageQuery } from "@/data/types/domain/prompt";

import { PromptService } from "./prompt.service";

const promptRepo = new PromptRepository(prisma);
const promptRepoMock = promptRepo as DeepMockProxy<PromptRepository>;

const promptService = new PromptService(promptRepoMock);

describe("getPromptss tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getPrompts - query undefined - test", async () => {
      const userId = "user-id-1";
      const page = ptestData.pPromptDescriptorsPage();
      promptRepoMock.pGetPromptDescriptors.mockResolvedValue(page);

      const result = await promptService.getPrompts(userId);
      const expectedResult = toDPromptDescriptorsPage(page);

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledWith(
         userId,
         undefined
      );
   });

   it("getPrompts - query empty - test", async () => {
      const userId = "user-id-123";
      const page = ptestData.pPromptDescriptorsPage();
      promptRepoMock.pGetPromptDescriptors.mockResolvedValue(page);

      const query: DPromptDescriptorsPageQuery = {};
      const result = await promptService.getPrompts(userId, query);
      const expectedResult = toDPromptDescriptorsPage(page);

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledWith(
         userId,
         query
      );
   });

   it("getPrompts - query defined - test", async () => {
      const userId = "user-id-456";
      const page = ptestData.pPromptDescriptorsPage();
      promptRepoMock.pGetPromptDescriptors.mockResolvedValue(page);

      const query = dtestData.dPromptsPageQuery();
      const result = await promptService.getPrompts(userId, query);
      const expectedResult = toDPromptDescriptorsPage(page);

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledWith(
         userId,
         query
      );
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
      const prompt = ptestData.pPromptDescriptorWithRelations();
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
      const userId = "user-id-123";
      const prompt = dtestData.dPromptUpdate();
      promptRepoMock.pCreatePrompt.mockRejectedValue(new Error("db error"));

      await expect(promptService.createPrompt(userId, prompt)).rejects.toThrow(
         "db error"
      );

      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledWith(userId, prompt);
   });

   it("createPrompt - prompt created  - test", async () => {
      const userId = "user-id-456";
      const prompt = dtestData.dPromptUpdate();

      await promptService.createPrompt(userId, prompt);

      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledWith(userId, prompt);
   });
});

describe("updatePrompt tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("updatePrompt - prompt not found - test", async () => {
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const prompt = dtestData.dPromptUpdate();
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(null);

      const fn = async () =>
         promptService.updatePrompt(promptId, prompt, false);

      await expect(fn).rejects.toThrow("Prompt not found");

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledWith({
         id: promptId,
      });
      expect(promptRepoMock.pUpdatePrompt).not.toHaveBeenCalled();
   });

   it("updatePrompt - error - test", async () => {
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPromptUpdate();
      const currentPrompt = ptestData.pPromptDescriptorWithRelations();
      currentPrompt.currentVersion = 1;
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(currentPrompt);
      const error = new Error("db error");
      promptRepoMock.pUpdatePrompt.mockRejectedValue(error);

      const fn = async () =>
         promptService.updatePrompt(promptId, promptUpdate, true);

      await expect(fn).rejects.toThrow("db error");

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         promptId,
         promptUpdate,
         currentPrompt,
         2,
         true
      );
   });

   it("updatePrompt - content not changed - createVersion false - test", async () => {
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPromptUpdate();
      const currentPrompt = ptestData.pPromptDescriptorWithRelations();
      currentPrompt.content = promptUpdate.content;
      currentPrompt.currentVersion = 1;
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(currentPrompt);

      await promptService.updatePrompt(promptId, promptUpdate, false);

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         promptId,
         promptUpdate,
         currentPrompt,
         1,
         false
      );
   });

   it("updatePrompt - content not changed - createVersion true - test", async () => {
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPromptUpdate();
      const currentPrompt = ptestData.pPromptDescriptorWithRelations();
      currentPrompt.content = promptUpdate.content;
      currentPrompt.currentVersion = 1;
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(currentPrompt);

      await promptService.updatePrompt(promptId, promptUpdate, true);

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         promptId,
         promptUpdate,
         currentPrompt,
         1,
         false
      );
   });

   it("updatePrompt - content changed - createVersion false - test", async () => {
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPromptUpdate();
      const currentPrompt = ptestData.pPromptDescriptorWithRelations();
      currentPrompt.currentVersion = 1;
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(currentPrompt);

      await promptService.updatePrompt(promptId, promptUpdate, false);

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         promptId,
         promptUpdate,
         currentPrompt,
         1,
         false
      );
   });

   it("updatePrompt - content changed - createVersion true - test", async () => {
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPromptUpdate();
      const currentPrompt = ptestData.pPromptDescriptorWithRelations();
      currentPrompt.currentVersion = 1;
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(currentPrompt);

      await promptService.updatePrompt(promptId, promptUpdate, true);

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         promptId,
         promptUpdate,
         currentPrompt,
         2,
         true
      );
   });
});

describe("toggleFavorite tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("toggleFavorite - error - test", async () => {
      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const error = new Error("db error");
      promptRepoMock.pToggleFavorite.mockRejectedValue(error);

      const fn = async () => promptService.toggleFavorite(id, true);

      await expect(fn).rejects.toThrow("db error");

      expect(promptRepoMock.pToggleFavorite).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pToggleFavorite).toHaveBeenCalledWith(id, true);
   });

   it("toggleFavorite - add to favorites - test", async () => {
      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      await promptService.toggleFavorite(id, true);

      expect(promptRepoMock.pToggleFavorite).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pToggleFavorite).toHaveBeenCalledWith(id, true);
   });

   it("toggleFavorite - remove from favorites - test", async () => {
      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      await promptService.toggleFavorite(id, false);

      expect(promptRepoMock.pToggleFavorite).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pToggleFavorite).toHaveBeenCalledWith(id, false);
   });
});

describe("deletePrompt tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("deletePrompt - error - test", async () => {
      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const error = new Error("db error");
      promptRepoMock.pDeletePrompt.mockRejectedValue(error);

      const fn = async () => promptService.deletePrompt(id);
      await expect(fn).rejects.toThrow("db error");

      expect(promptRepoMock.pDeletePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pDeletePrompt).toHaveBeenCalledWith(id);
   });

   it("deletePrompt - prompt deleted - test", async () => {
      const id = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      await promptService.deletePrompt(id);

      expect(promptRepoMock.pDeletePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pDeletePrompt).toHaveBeenCalledWith(id);
   });
});
