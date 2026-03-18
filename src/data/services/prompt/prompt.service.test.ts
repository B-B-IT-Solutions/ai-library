jest.mock("@/data/repositories/prompt");

import { dtestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PromptRepository } from "@/data/repositories/prompt";
import { DPromptDescriptorsPageQuery } from "@/data/types/domain/prompt";
import {
   PromptDescriptorCreateInput,
   PromptDescriptorUpdateInput,
   PromptFollowUpUpdateManyWithoutPromptNestedInput,
} from "@/generated/prisma/models";

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

      const promptToSave: PromptDescriptorCreateInput = {
         title: prompt.title,
         content: prompt.content,
         recommendedModel: prompt.recommendedModel,
         currentVersion: 0,
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
                  content: "prompt follow up update 0",
                  order: 0,
               },
               {
                  content: "prompt follow up update 1",
                  order: 1,
               },
               {
                  content: "prompt follow up update 2",
                  order: 2,
               },
            ],
         },
         user: {
            connect: {
               id: userId,
            },
         },
      };

      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledWith(promptToSave);
   });

   it("createPrompt - prompt created  - test", async () => {
      const userId = "user-id-456";
      const prompt = dtestData.dPromptUpdate();

      await promptService.createPrompt(userId, prompt);

      const promptToSave: PromptDescriptorCreateInput = {
         title: prompt.title,
         content: prompt.content,
         recommendedModel: prompt.recommendedModel,
         currentVersion: 0,
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
                  content: "prompt follow up update 0",
                  order: 0,
               },
               {
                  content: "prompt follow up update 1",
                  order: 1,
               },
               {
                  content: "prompt follow up update 2",
                  order: 2,
               },
            ],
         },
         user: {
            connect: {
               id: userId,
            },
         },
      };

      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pCreatePrompt).toHaveBeenCalledWith(promptToSave);
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

      const expectedFollowUpPromptUpdates = promptService.followUpPromptUpdates(
         currentPrompt,
         promptUpdate
      );

      const expectedData: PromptDescriptorUpdateInput = {
         title: promptUpdate.title,
         content: promptUpdate.content,
         recommendedModel: promptUpdate.recommendedModel,
         currentVersion: 2,
         categories: {
            set: [],
            connectOrCreate: [
               {
                  where: { name: "category 1" },
                  create: { name: "category 1" },
               },
            ],
         },
         followUpPrompts: expectedFollowUpPromptUpdates,
         versions: {
            create: {
               version: 2,
               content: promptUpdate.content,
            },
         },
      };

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         promptId,
         expectedData
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

      const expectedFollowUpPromptUpdates = promptService.followUpPromptUpdates(
         currentPrompt,
         promptUpdate
      );

      const expectedData: PromptDescriptorUpdateInput = {
         title: promptUpdate.title,
         content: promptUpdate.content,
         recommendedModel: promptUpdate.recommendedModel,
         currentVersion: 1,
         categories: {
            set: [],
            connectOrCreate: [
               {
                  where: { name: "category 1" },
                  create: { name: "category 1" },
               },
            ],
         },
         followUpPrompts: expectedFollowUpPromptUpdates,
         versions: undefined,
      };

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         promptId,
         expectedData
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

      const expectedFollowUpPromptUpdates = promptService.followUpPromptUpdates(
         currentPrompt,
         promptUpdate
      );

      const expectedData: PromptDescriptorUpdateInput = {
         title: promptUpdate.title,
         content: promptUpdate.content,
         recommendedModel: promptUpdate.recommendedModel,
         currentVersion: 1,
         categories: {
            set: [],
            connectOrCreate: [
               {
                  where: { name: "category 1" },
                  create: { name: "category 1" },
               },
            ],
         },
         followUpPrompts: expectedFollowUpPromptUpdates,
         versions: undefined,
      };

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         promptId,
         expectedData
      );
   });

   it("updatePrompt - content changed - createVersion false - test", async () => {
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPromptUpdate();
      const currentPrompt = ptestData.pPromptDescriptorWithRelations();
      currentPrompt.currentVersion = 1;
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(currentPrompt);

      await promptService.updatePrompt(promptId, promptUpdate, false);

      const expectedFollowUpPromptUpdates = promptService.followUpPromptUpdates(
         currentPrompt,
         promptUpdate
      );

      const expectedData: PromptDescriptorUpdateInput = {
         title: promptUpdate.title,
         content: promptUpdate.content,
         recommendedModel: promptUpdate.recommendedModel,
         currentVersion: 1,
         categories: {
            set: [],
            connectOrCreate: [
               {
                  where: { name: "category 1" },
                  create: { name: "category 1" },
               },
            ],
         },
         followUpPrompts: expectedFollowUpPromptUpdates,
         versions: undefined,
      };

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         promptId,
         expectedData
      );
   });

   it("updatePrompt - content changed - createVersion true - test", async () => {
      const promptId = "6d3266e8-a69e-42aa-a04f-9953c211f509";
      const promptUpdate = dtestData.dPromptUpdate();
      const currentPrompt = ptestData.pPromptDescriptorWithRelations();
      currentPrompt.currentVersion = 1;
      promptRepoMock.pGetPromptDescriptor.mockResolvedValue(currentPrompt);

      await promptService.updatePrompt(promptId, promptUpdate, true);

      const expectedFollowUpPromptUpdates = promptService.followUpPromptUpdates(
         currentPrompt,
         promptUpdate
      );

      const expectedData: PromptDescriptorUpdateInput = {
         title: promptUpdate.title,
         content: promptUpdate.content,
         recommendedModel: promptUpdate.recommendedModel,
         currentVersion: 2,
         categories: {
            set: [],
            connectOrCreate: [
               {
                  where: { name: "category 1" },
                  create: { name: "category 1" },
               },
            ],
         },
         followUpPrompts: expectedFollowUpPromptUpdates,
         versions: {
            create: {
               version: 2,
               content: promptUpdate.content,
            },
         },
      };

      expect(promptRepoMock.pGetPromptDescriptor).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledTimes(1);
      expect(promptRepoMock.pUpdatePrompt).toHaveBeenCalledWith(
         promptId,
         expectedData
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

describe("followUpPromptUpdates tests", () => {
   const id0 = "f23c15c7-7d2d-40a2-a895-6a78516b9b30";
   const id1 = "f23c15c7-7d2d-40a2-a895-6a78516b9b31";
   const id2 = "f23c15c7-7d2d-40a2-a895-6a78516b9b32";

   it("all new follow-ups (no ids) - existing deleted - test", () => {
      const current = ptestData.pPromptDescriptorWithRelations();
      const promptUpdate = dtestData.dPromptUpdate();
      // dPromptUpdate uses dPromptFollowUpUpdates() which has no ids

      const result = promptService.followUpPromptUpdates(current, promptUpdate);

      const expectedResult: PromptFollowUpUpdateManyWithoutPromptNestedInput = {
         update: undefined,
         create: [
            { content: "prompt follow up update 0", order: 0 },
            { content: "prompt follow up update 1", order: 1 },
            { content: "prompt follow up update 2", order: 2 },
         ],
         deleteMany: { id: { in: [id0, id1, id2] } },
      };

      expect(result).toEqual(expectedResult);
   });

   it("all existing follow-ups updated (matching ids) - test", () => {
      const current = ptestData.pPromptDescriptorWithRelations();
      const promptUpdate = dtestData.dPromptUpdate();
      promptUpdate.followUpPrompts = [
         { id: id0, content: "updated 0", order: 0 },
         { id: id1, content: "updated 1", order: 1 },
         { id: id2, content: "updated 2", order: 2 },
      ];

      const result = promptService.followUpPromptUpdates(current, promptUpdate);

      const expectedResult: PromptFollowUpUpdateManyWithoutPromptNestedInput = {
         update: [
            { where: { id: id0 }, data: { content: "updated 0", order: 0 } },
            { where: { id: id1 }, data: { content: "updated 1", order: 1 } },
            { where: { id: id2 }, data: { content: "updated 2", order: 2 } },
         ],
         create: undefined,
         deleteMany: undefined,
      };

      expect(result).toEqual(expectedResult);
   });

   it("empty update list - all existing deleted - test", () => {
      const current = ptestData.pPromptDescriptorWithRelations();
      const promptUpdate = dtestData.dPromptUpdate();
      promptUpdate.followUpPrompts = [];

      const result = promptService.followUpPromptUpdates(current, promptUpdate);

      const expectedResult: PromptFollowUpUpdateManyWithoutPromptNestedInput = {
         update: undefined,
         create: undefined,
         deleteMany: { id: { in: [id0, id1, id2] } },
      };

      expect(result).toEqual(expectedResult);
   });

   it("mix: 2 updated + 1 new + 1 deleted - test", () => {
      const current = ptestData.pPromptDescriptorWithRelations();
      const promptUpdate = dtestData.dPromptUpdate();
      promptUpdate.followUpPrompts = [
         { id: id0, content: "updated 0", order: 0 },
         { id: id1, content: "updated 1", order: 1 },
         { content: "new follow up", order: 2 },
      ];
      // id2 is not present → should be deleted

      const result = promptService.followUpPromptUpdates(current, promptUpdate);

      const expectedResult: PromptFollowUpUpdateManyWithoutPromptNestedInput = {
         update: [
            {
               where: { id: id0 },
               data: { content: "updated 0", order: 0 },
            },
            {
               where: { id: id1 },
               data: { content: "updated 1", order: 1 },
            },
         ],
         create: [{ content: "new follow up", order: 2 }],
         deleteMany: { id: { in: [id2] } },
      };

      expect(result).toEqual(expectedResult);
   });

   it("no existing follow-ups, no updates - all undefined - test", () => {
      const current = ptestData.pPromptDescriptorWithRelations();
      current.followUpPrompts = [];
      const promptUpdate = dtestData.dPromptUpdate();
      promptUpdate.followUpPrompts = [];

      const result = promptService.followUpPromptUpdates(current, promptUpdate);

      const expectedResult: PromptFollowUpUpdateManyWithoutPromptNestedInput = {
         update: undefined,
         create: undefined,
         deleteMany: undefined,
      };

      expect(result).toEqual(expectedResult);
   });

   it("no existing follow-ups, add new - test", () => {
      const current = ptestData.pPromptDescriptorWithRelations();
      current.followUpPrompts = [];
      const promptUpdate = dtestData.dPromptUpdate();
      promptUpdate.followUpPrompts = [
         { content: "new 1", order: 0 },
         { content: "new 2", order: 1 },
      ];

      const result = promptService.followUpPromptUpdates(current, promptUpdate);

      const expectedResult: PromptFollowUpUpdateManyWithoutPromptNestedInput = {
         update: undefined,
         create: [
            { content: "new 1", order: 0 },
            { content: "new 2", order: 1 },
         ],
         deleteMany: undefined,
      };

      expect(result).toEqual(expectedResult);
   });
});
