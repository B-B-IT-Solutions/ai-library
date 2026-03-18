import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PromptDescriptorsPage } from "@/data/types/db/prompt";
import { DPromptDescriptorsPageQuery } from "@/data/types/domain/prompt";
import {
   PromptCategoryFindManyArgs,
   PromptDescriptorCountArgs,
   PromptDescriptorCreateArgs,
   PromptDescriptorDeleteArgs,
   PromptDescriptorFindFirstArgs,
   PromptDescriptorFindManyArgs,
   PromptDescriptorUpdateArgs,
   PromptDescriptorWhereInput,
   PromptFollowUpUpdateManyWithoutPromptNestedInput,
} from "@/generated/prisma/models";

import { toDPromptDescriptor, toDPromptDescriptorsPage } from "./prompt.mapper";
import { PromptRepository } from "./prompt.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const promptRepository = new PromptRepository(prismaMock);

describe("pGetPromptDescriptors tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetPromptDescriptors - query undefined - test", async () => {
      const userId = "user-id-1";
      const prompts = ptestData.pPromptDescriptorsWithRelations();
      prismaMock.promptDescriptor.findMany.mockResolvedValue(prompts);
      prismaMock.promptDescriptor.count.mockResolvedValue(prompts.length);

      const result = await promptRepository.pGetPromptDescriptors(userId);

      const expectedDbResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 0,
         pageSize: 10,
         totalElements: 3,
         totalPages: 1,
      };
      const expectedResult = toDPromptDescriptorsPage(expectedDbResult);
      const expectedWhereClause: PromptDescriptorWhereInput = {
         userId,
      };
      const expectedFindManyArgs: PromptDescriptorFindManyArgs = {
         where: expectedWhereClause,
         skip: 0,
         take: 10,
         include: {
            categories: true,
         },
         orderBy: { updatedAt: "desc" },
      };
      const expedtedCountArgs: PromptDescriptorCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptDescriptor.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptDescriptor.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.count).toHaveBeenCalledWith(
         expedtedCountArgs
      );
   });

   test("pGetPromptDescriptors - query empty - test", async () => {
      const userId = "user-id-111";
      const prompts = ptestData.pPromptDescriptorsWithRelations();
      prismaMock.promptDescriptor.findMany.mockResolvedValue(prompts);
      prismaMock.promptDescriptor.count.mockResolvedValue(prompts.length);

      const query: DPromptDescriptorsPageQuery = {};
      const result = await promptRepository.pGetPromptDescriptors(
         userId,
         query
      );

      const expectedDbResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 0,
         pageSize: 10,
         totalElements: 3,
         totalPages: 1,
      };
      const expectedResult = toDPromptDescriptorsPage(expectedDbResult);
      const expectedWhereClause: PromptDescriptorWhereInput = {
         userId,
      };
      const expectedFindManyArgs: PromptDescriptorFindManyArgs = {
         where: expectedWhereClause,
         skip: 0,
         take: 10,
         include: {
            categories: true,
         },
         orderBy: { updatedAt: "desc" },
      };
      const expedtedCountArgs: PromptDescriptorCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptDescriptor.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptDescriptor.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.count).toHaveBeenCalledWith(
         expedtedCountArgs
      );
   });

   test("pGetPromptDescriptors - query.globalFilter defined - test", async () => {
      const userId = "user-id-123";
      const prompts = ptestData.pPromptDescriptorsWithRelations(21);
      prismaMock.promptDescriptor.findMany.mockResolvedValue(prompts);
      prismaMock.promptDescriptor.count.mockResolvedValue(prompts.length);

      const query: DPromptDescriptorsPageQuery = {
         pagination: { pageNumber: 3, pageSize: 5 },
         globalFilter: "test 123",
      };
      const result = await promptRepository.pGetPromptDescriptors(
         userId,
         query
      );

      const expectedDbResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
      const expectedResult = toDPromptDescriptorsPage(expectedDbResult);
      const expectedWhereClause: PromptDescriptorWhereInput = {
         userId,
         OR: [
            {
               title: {
                  contains: query.globalFilter,
                  mode: "insensitive",
               },
            },
            {
               content: {
                  contains: query.globalFilter,
                  mode: "insensitive",
               },
            },
         ],
      };
      const expectedFindManyArgs: PromptDescriptorFindManyArgs = {
         where: expectedWhereClause,
         skip: 15,
         take: 5,
         include: {
            categories: true,
         },
         orderBy: { updatedAt: "desc" },
      };
      const expedtedCountArgs: PromptDescriptorCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptDescriptor.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptDescriptor.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.count).toHaveBeenCalledWith(
         expedtedCountArgs
      );
   });

   test("pGetPromptDescriptors - query.filter defined - test", async () => {
      const userId = "user-id-123";
      const prompts = ptestData.pPromptDescriptorsWithRelations(21);
      prismaMock.promptDescriptor.findMany.mockResolvedValue(prompts);
      prismaMock.promptDescriptor.count.mockResolvedValue(prompts.length);

      const query: DPromptDescriptorsPageQuery = {
         pagination: { pageNumber: 3, pageSize: 5 },
         filter: {
            categories: ["cat 123"],
            isFavorite: true,
         },
      };
      const result = await promptRepository.pGetPromptDescriptors(
         userId,
         query
      );

      const expectedDbResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
      const expectedResult = toDPromptDescriptorsPage(expectedDbResult);
      const expectedWhereClause: PromptDescriptorWhereInput = {
         userId,
         AND: [
            {
               categories: {
                  some: {
                     name: {
                        in: query.filter!.categories,
                     },
                  },
               },
            },
         ],
         isFavorite: true,
      };
      const expectedFindManyArgs: PromptDescriptorFindManyArgs = {
         where: expectedWhereClause,
         skip: 15,
         take: 5,
         include: {
            categories: true,
         },
         orderBy: { updatedAt: "desc" },
      };
      const expedtedCountArgs: PromptDescriptorCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptDescriptor.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptDescriptor.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.count).toHaveBeenCalledWith(
         expedtedCountArgs
      );
   });

   test("pGetPromptDescriptors - query defined - test", async () => {
      const userId = "user-id-456";
      const prompts = ptestData.pPromptDescriptorsWithRelations(21);
      prismaMock.promptDescriptor.findMany.mockResolvedValue(prompts);
      prismaMock.promptDescriptor.count.mockResolvedValue(prompts.length);

      const query: DPromptDescriptorsPageQuery = {
         pagination: { pageNumber: 3, pageSize: 5 },
         globalFilter: "test 1",
         filter: {
            categories: ["cat 1"],
         },
      };
      const result = await promptRepository.pGetPromptDescriptors(
         userId,
         query
      );

      const expectedDbResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
      const expectedResult = toDPromptDescriptorsPage(expectedDbResult);
      const expectedWhereClause: PromptDescriptorWhereInput = {
         userId,
         OR: [
            {
               title: {
                  contains: query.globalFilter,
                  mode: "insensitive",
               },
            },
            {
               content: {
                  contains: query.globalFilter,
                  mode: "insensitive",
               },
            },
         ],
         AND: [
            {
               categories: {
                  some: {
                     name: {
                        in: query.filter!.categories,
                     },
                  },
               },
            },
         ],
      };
      const expectedFindManyArgs: PromptDescriptorFindManyArgs = {
         where: expectedWhereClause,
         skip: 15,
         take: 5,
         include: {
            categories: true,
         },
         orderBy: { updatedAt: "desc" },
      };
      const expedtedCountArgs: PromptDescriptorCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptDescriptor.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptDescriptor.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.count).toHaveBeenCalledWith(
         expedtedCountArgs
      );
   });
});

describe("pGetPromptDescriptor tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetPromptDescriptor - prompt found - test", async () => {
      const prompt = ptestData.pPromptDescriptorWithRelations();
      prismaMock.promptDescriptor.findFirst.mockResolvedValue(prompt);

      const promptId = "1";
      const userId = "user-id-1";
      const result = await promptRepository.pGetPromptDescriptor(
         userId,
         promptId
      );

      const expectedResult = toDPromptDescriptor(prompt);

      const expectedWhere: PromptDescriptorFindFirstArgs = {
         where: {
            id: promptId,
            userId,
         },
         include: {
            categories: true,
            versions: {
               orderBy: { version: "desc" },
            },
            followUpPrompts: {
               orderBy: { order: "asc" },
            },
         },
      };
      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptDescriptor.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.findFirst).toHaveBeenCalledWith(
         expectedWhere
      );
   });

   test("pGetPromptDescriptor - prompt not found (wrong user) - test", async () => {
      prismaMock.promptDescriptor.findFirst.mockResolvedValue(null);

      const promptId = "1";
      const userId = "other-user-id";
      const result = await promptRepository.pGetPromptDescriptor(
         userId,
         promptId
      );

      const expectedWhere: PromptDescriptorFindFirstArgs = {
         where: {
            id: promptId,
            userId,
         },
         include: {
            categories: true,
            versions: {
               orderBy: { version: "desc" },
            },
            followUpPrompts: {
               orderBy: { order: "asc" },
            },
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.promptDescriptor.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.findFirst).toHaveBeenCalledWith(
         expectedWhere
      );
   });
});

describe("getPromptCategories queries tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("getPromptCategories - categories retrieved - test", async () => {
      const categories = ptestData.pPromptCategories();
      prismaMock.promptCategory.findMany.mockResolvedValue(categories);

      const userId = "user-id-1";
      const result = await promptRepository.pGetPromptCategories(userId);

      const expectedFindMayArgs: PromptCategoryFindManyArgs = {
         where: {
            prompts: {
               some: { userId },
            },
         },
         select: {
            name: true,
         },
      };

      expect(result).toEqual(categories);
      expect(prismaMock.promptCategory.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });
});

describe("pCreatePrompt tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pCreatePrompt - prompt created - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptUpdate();
      const created = ptestData.pPromptDescriptor();
      prismaMock.promptDescriptor.create.mockResolvedValue(created);

      const result = await promptRepository.pCreatePrompt(userId, data);

      const expectedCreateArgs: PromptDescriptorCreateArgs = {
         data: {
            title: data.title,
            content: data.content,
            recommendedModel: data.recommendedModel,
            currentVersion: 0,
            categories: {
               connectOrCreate: [
                  {
                     where: { name: "category 1" },
                     create: { name: "category 1" },
                  },
               ],
            },
            followUpPrompts: {
               create: [
                  { content: "prompt follow up update 0", order: 0 },
                  { content: "prompt follow up update 1", order: 1 },
                  { content: "prompt follow up update 2", order: 2 },
               ],
            },
            user: {
               connect: { id: userId },
            },
         },
      };

      expect(result).toEqual(created);
      expect(prismaMock.promptDescriptor.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.create).toHaveBeenCalledWith(
         expectedCreateArgs
      );
   });
});

describe("pUpdatePrompt tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pUpdatePrompt - no version created - test", async () => {
      const userId = "user-id-1";
      const promptId = "prompt-id-1";
      const data = dtestData.dPromptUpdate();
      const current = dtestData.dPromptDescriptor();
      current.currentVersion = 1;
      const updated = ptestData.pPromptDescriptor();
      prismaMock.promptDescriptor.update.mockResolvedValue(updated);

      const result = await promptRepository.pUpdatePrompt(
         userId,
         promptId,
         data,
         current,
         1,
         false
      );

      const expectedFollowUpUpdates = promptRepository.followUpPromptUpdates(
         current,
         data
      );

      const expectedUpdateArgs: PromptDescriptorUpdateArgs = {
         where: { id: promptId, userId },
         data: {
            title: data.title,
            content: data.content,
            recommendedModel: data.recommendedModel,
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
            followUpPrompts: expectedFollowUpUpdates,
            versions: undefined,
         },
      };

      expect(result).toEqual(updated);
      expect(prismaMock.promptDescriptor.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });

   test("pUpdatePrompt - version created - test", async () => {
      const userId = "user-id-1";
      const promptId = "prompt-id-1";
      const data = dtestData.dPromptUpdate();
      const current = dtestData.dPromptDescriptor();
      current.currentVersion = 1;
      const updated = ptestData.pPromptDescriptor();
      prismaMock.promptDescriptor.update.mockResolvedValue(updated);

      const result = await promptRepository.pUpdatePrompt(
         userId,
         promptId,
         data,
         current,
         2,
         true
      );

      const expectedFollowUpUpdates = promptRepository.followUpPromptUpdates(
         current,
         data
      );

      const expectedUpdateArgs: PromptDescriptorUpdateArgs = {
         where: { id: promptId, userId },
         data: {
            title: data.title,
            content: data.content,
            recommendedModel: data.recommendedModel,
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
            followUpPrompts: expectedFollowUpUpdates,
            versions: {
               create: {
                  version: 2,
                  content: data.content,
               },
            },
         },
      };

      expect(result).toEqual(updated);
      expect(prismaMock.promptDescriptor.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });
});

describe("pToggleFavorite tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pToggleFavorite - isFavorite true - test", async () => {
      const promptId = "prompt-id-1";
      const userId = "user-id-1";

      await promptRepository.pToggleFavorite(userId, promptId, true);

      const expectedUpdateArgs: PromptDescriptorUpdateArgs = {
         where: { id: promptId, userId },
         data: { isFavorite: true },
      };

      expect(prismaMock.promptDescriptor.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });

   test("pToggleFavorite - isFavorite false - test", async () => {
      const promptId = "prompt-id-1";
      const userId = "user-id-1";

      await promptRepository.pToggleFavorite(userId, promptId, false);

      const expectedUpdateArgs: PromptDescriptorUpdateArgs = {
         where: { id: promptId, userId },
         data: { isFavorite: false },
      };

      expect(prismaMock.promptDescriptor.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });
});

describe("pDeletePrompt tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pDeletePrompt - prompt deleted - test", async () => {
      const promptId = "prompt-id-1";
      const userId = "user-id-1";

      await promptRepository.pDeletePrompt(userId, promptId);

      const expectedUpdateArgs: PromptDescriptorDeleteArgs = {
         where: { id: promptId, userId },
      };

      expect(prismaMock.promptDescriptor.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.delete).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });
});

describe("followUpPromptUpdates tests", () => {
   const id0 = "f23c15c7-7d2d-40a2-a895-6a78516b9b30";
   const id1 = "f23c15c7-7d2d-40a2-a895-6a78516b9b31";
   const id2 = "f23c15c7-7d2d-40a2-a895-6a78516b9b32";

   it("all new follow-ups (no ids) - existing deleted - test", () => {
      const current = dtestData.dPromptDescriptor();
      const promptUpdate = dtestData.dPromptUpdate();

      const result = promptRepository.followUpPromptUpdates(
         current,
         promptUpdate
      );

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
      const current = dtestData.dPromptDescriptor();
      const promptUpdate = dtestData.dPromptUpdate();
      promptUpdate.followUpPrompts = [
         { id: id0, content: "updated 0", order: 0 },
         { id: id1, content: "updated 1", order: 1 },
         { id: id2, content: "updated 2", order: 2 },
      ];

      const result = promptRepository.followUpPromptUpdates(
         current,
         promptUpdate
      );

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
      const current = dtestData.dPromptDescriptor();
      const promptUpdate = dtestData.dPromptUpdate();
      promptUpdate.followUpPrompts = [];

      const result = promptRepository.followUpPromptUpdates(
         current,
         promptUpdate
      );

      const expectedResult: PromptFollowUpUpdateManyWithoutPromptNestedInput = {
         update: undefined,
         create: undefined,
         deleteMany: { id: { in: [id0, id1, id2] } },
      };

      expect(result).toEqual(expectedResult);
   });

   it("mix: 2 updated + 1 new + 1 deleted - test", () => {
      const current = dtestData.dPromptDescriptor();
      const promptUpdate = dtestData.dPromptUpdate();
      promptUpdate.followUpPrompts = [
         { id: id0, content: "updated 0", order: 0 },
         { id: id1, content: "updated 1", order: 1 },
         { content: "new follow up", order: 2 },
      ];

      const result = promptRepository.followUpPromptUpdates(
         current,
         promptUpdate
      );

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
      const current = dtestData.dPromptDescriptor();
      current.followUpPrompts = [];
      const promptUpdate = dtestData.dPromptUpdate();
      promptUpdate.followUpPrompts = [];

      const result = promptRepository.followUpPromptUpdates(
         current,
         promptUpdate
      );

      const expectedResult: PromptFollowUpUpdateManyWithoutPromptNestedInput = {
         update: undefined,
         create: undefined,
         deleteMany: undefined,
      };

      expect(result).toEqual(expectedResult);
   });

   it("no existing follow-ups, add new - test", () => {
      const current = dtestData.dPromptDescriptor();
      current.followUpPrompts = [];
      const promptUpdate = dtestData.dPromptUpdate();
      promptUpdate.followUpPrompts = [
         { content: "new 1", order: 0 },
         { content: "new 2", order: 1 },
      ];

      const result = promptRepository.followUpPromptUpdates(
         current,
         promptUpdate
      );

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
