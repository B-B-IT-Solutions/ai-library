jest.mock("@/data/repositories/prompt0");

import { dtestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PromptRepository } from "@/data/repositories/prompt0";
import { DPrompt0sPageQuery } from "@/data/types/domain/prompt0";

import { Prompt0Service } from "./prompt0.service";

const promptRepo = new PromptRepository(prisma);
const promptRepoMock = promptRepo as DeepMockProxy<PromptRepository>;

const promptService = new Prompt0Service(promptRepoMock);

describe("getPrompt0s tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("query undefined - test", async () => {
      const userId = "user-id-1";
      const page = dtestData.dPrompt0sPage();
      promptRepoMock.pGetPromptDescriptors.mockResolvedValue(page);

      const result = await promptService.getPrompt0s(userId);

      expect(result).toEqual(page);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledWith(
         userId,
         undefined
      );
   });

   it("query empty - test", async () => {
      const userId = "user-id-123";
      const page = dtestData.dPrompt0sPage();
      promptRepoMock.pGetPromptDescriptors.mockResolvedValue(page);

      const query: DPrompt0sPageQuery = {};
      const result = await promptService.getPrompt0s(userId, query);

      expect(result).toEqual(page);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledWith(
         userId,
         query
      );
   });

   it("query defined - test", async () => {
      const userId = "user-id-456";
      const page = dtestData.dPrompt0sPage();
      promptRepoMock.pGetPromptDescriptors.mockResolvedValue(page);

      const query = dtestData.dPrompt0sPageQuery();
      const result = await promptService.getPrompt0s(userId, query);

      expect(result).toEqual(page);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptors).toHaveBeenCalledWith(
         userId,
         query
      );
   });
});

describe("getPrompt0Categories tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("categories retrieved - test", async () => {
      const userId = "user-id-1";
      const categories = dtestData.dPrompt0Categories();
      promptRepoMock.pGetPromptCategories.mockResolvedValue(categories);

      const result = await promptService.getPrompt0Categories(userId);
      const expectedResult = map(categories, (c) => c.name);

      expect(result).toEqual(expectedResult);
      expect(promptRepoMock.pGetPromptCategories).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptCategories).toHaveBeenCalledWith(userId);
   });
});

describe("getPrompt0 tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("prompt undefined - test", async () => {
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(null);

      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await promptService.getPrompt0(userId, promptId);

      expect(result).toBeNull();
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledWith(
         userId,
         promptId
      );
   });

   it("prompt defined - test", async () => {
      const prompt = dtestData.dPrompt0();
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(prompt);

      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const result = await promptService.getPrompt0(userId, promptId);

      expect(result).toEqual(prompt);
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledWith(
         userId,
         promptId
      );
   });
});

describe("createPrompt0 tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("error - test", async () => {
      const userId = "user-id-123";
      const prompt = dtestData.dPrompt0Update();
      promptRepoMock.pCreatePrompt.mockRejectedValue(new Error("db error"));

      await expect(promptService.createPrompt0(userId, prompt)).rejects.toThrow(
         "db error"
      );

      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledWith(userId, prompt);
   });

   it("prompt0 created  - test", async () => {
      const userId = "user-id-456";
      const prompt = dtestData.dPrompt0Update();

      await promptService.createPrompt0(userId, prompt);

      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledWith(userId, prompt);
   });
});

describe("updatePrompt0 tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("prompt0 not found - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const prompt = dtestData.dPrompt0Update();
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(null);

      const fn = async () =>
         promptService.updatePrompt0(userId, promptId, prompt, false);

      await expect(fn).rejects.toThrow("Prompt not found");

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledWith(
         userId,
         promptId
      );
      expect(promptRepoMock.pUpdatePrompt).not.toHaveBeenCalled();
   });

   it("error - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPrompt0Update();
      const currentPrompt = dtestData.dPrompt0();
      currentPrompt.currentVersion = 1;
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(currentPrompt);
      const error = new Error("db error");
      promptRepoMock.pUpdatePrompt.mockRejectedValue(error);

      const fn = async () =>
         promptService.updatePrompt0(userId, promptId, promptUpdate, true);

      await expect(fn).rejects.toThrow("db error");

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledWith(
         userId,
         promptId
      );
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         userId,
         promptId,
         promptUpdate,
         currentPrompt,
         2,
         true
      );
   });

   it("content not changed - createVersion false - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPrompt0Update();
      const currentPrompt = dtestData.dPrompt0();
      currentPrompt.content = promptUpdate.content;
      currentPrompt.currentVersion = 1;
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(currentPrompt);

      await promptService.updatePrompt0(userId, promptId, promptUpdate, false);

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledWith(
         userId,
         promptId
      );
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         userId,
         promptId,
         promptUpdate,
         currentPrompt,
         1,
         false
      );
   });

   it("content not changed - createVersion true - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPrompt0Update();
      const currentPrompt = dtestData.dPrompt0();
      currentPrompt.content = promptUpdate.content;
      currentPrompt.currentVersion = 1;
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(currentPrompt);

      await promptService.updatePrompt0(userId, promptId, promptUpdate, true);

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledWith(
         userId,
         promptId
      );
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         userId,
         promptId,
         promptUpdate,
         currentPrompt,
         1,
         false
      );
   });

   it("content changed - createVersion false - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPrompt0Update();
      const currentPrompt = dtestData.dPrompt0();
      currentPrompt.currentVersion = 1;
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(currentPrompt);

      await promptService.updatePrompt0(userId, promptId, promptUpdate, false);

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledWith(
         userId,
         promptId
      );
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         userId,
         promptId,
         promptUpdate,
         currentPrompt,
         1,
         false
      );
   });

   it("content changed - createVersion true - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPrompt0Update();
      const currentPrompt = dtestData.dPrompt0();
      currentPrompt.currentVersion = 1;
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(currentPrompt);

      await promptService.updatePrompt0(userId, promptId, promptUpdate, true);

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledWith(
         userId,
         promptId
      );
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         userId,
         promptId,
         promptUpdate,
         currentPrompt,
         2,
         true
      );
   });
});

describe("deletePrompt0 tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("prompt0 deleted - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      await promptService.deletePrompt0(userId, promptId);

      expect(promptRepoMock.pDeletePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pDeletePrompt).toHaveBeenCalledWith(
         userId,
         promptId
      );
   });
});

describe("toggleFavorite tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("toggleFavorite - add to favorites - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      await promptService.toggleFavorite(userId, promptId, true);

      expect(promptRepoMock.pToggleFavorite).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pToggleFavorite).toHaveBeenCalledWith(
         userId,
         promptId,
         true
      );
   });

   it("toggleFavorite - remove from favorites - test", async () => {
      const userId = "user-id-1";
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";

      await promptService.toggleFavorite(userId, promptId, false);

      expect(promptRepoMock.pToggleFavorite).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pToggleFavorite).toHaveBeenCalledWith(
         userId,
         promptId,
         false
      );
   });
});
