import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { Prompt0sPage } from "@/data/types/db/prompt0";
import { DPrompt0sPageQuery } from "@/data/types/domain/prompt0";
import {
   Prompt0CategoryFindManyArgs,
   Prompt0CountArgs,
   Prompt0CreateArgs,
   Prompt0DeleteArgs,
   Prompt0FindFirstArgs,
   Prompt0FindManyArgs,
   Prompt0FollowUpUpdateManyWithoutPromptNestedInput,
   Prompt0UpdateArgs,
   Prompt0WhereInput,
} from "@/generated/prisma/models";

import {
   toDPromptDescriptor,
   toDPromptDescriptorsPage,
} from "./prompt0.mapper";
import { PromptRepository } from "./prompt0.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const promptRepository = new PromptRepository(prismaMock);

describe("pGetPromptDescriptors tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetPromptDescriptors - query undefined - test", async () => {
      const userId = "user-id-1";
      const prompts = ptestData.pPromptDescriptorsWithRelations();
      prismaMock.prompt0.findMany.mockResolvedValue(prompts);
      prismaMock.prompt0.count.mockResolvedValue(prompts.length);

      const result = await promptRepository.pGetPromptDescriptors(userId);

      const expectedDbResult: Prompt0sPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 0,
         pageSize: 10,
         totalElements: 3,
         totalPages: 1,
      };
      const expectedResult = toDPromptDescriptorsPage(expectedDbResult);
      const expectedWhereClause: Prompt0WhereInput = {
         userId,
      };
      const expectedFindManyArgs: Prompt0FindManyArgs = {
         where: expectedWhereClause,
         skip: 0,
         take: 10,
         include: {
            categories: true,
         },
         orderBy: { updatedAt: "desc" },
      };
      const expedtedCountArgs: Prompt0CountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt0.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt0.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.count).toHaveBeenCalledWith(expedtedCountArgs);
   });

   test("pGetPromptDescriptors - query empty - test", async () => {
      const userId = "user-id-111";
      const prompts = ptestData.pPromptDescriptorsWithRelations();
      prismaMock.prompt0.findMany.mockResolvedValue(prompts);
      prismaMock.prompt0.count.mockResolvedValue(prompts.length);

      const query: DPrompt0sPageQuery = {};
      const result = await promptRepository.pGetPromptDescriptors(
         userId,
         query
      );

      const expectedDbResult: Prompt0sPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 0,
         pageSize: 10,
         totalElements: 3,
         totalPages: 1,
      };
      const expectedResult = toDPromptDescriptorsPage(expectedDbResult);
      const expectedWhereClause: Prompt0WhereInput = {
         userId,
      };
      const expectedFindManyArgs: Prompt0FindManyArgs = {
         where: expectedWhereClause,
         skip: 0,
         take: 10,
         include: {
            categories: true,
         },
         orderBy: { updatedAt: "desc" },
      };
      const expedtedCountArgs: Prompt0CountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt0.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt0.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.count).toHaveBeenCalledWith(expedtedCountArgs);
   });

   test("pGetPromptDescriptors - query.globalFilter defined - test", async () => {
      const userId = "user-id-123";
      const prompts = ptestData.pPromptDescriptorsWithRelations(21);
      prismaMock.prompt0.findMany.mockResolvedValue(prompts);
      prismaMock.prompt0.count.mockResolvedValue(prompts.length);

      const query: DPrompt0sPageQuery = {
         pagination: { pageNumber: 3, pageSize: 5 },
         globalFilter: "test 123",
      };
      const result = await promptRepository.pGetPromptDescriptors(
         userId,
         query
      );

      const expectedDbResult: Prompt0sPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
      const expectedResult = toDPromptDescriptorsPage(expectedDbResult);
      const expectedWhereClause: Prompt0WhereInput = {
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
      const expectedFindManyArgs: Prompt0FindManyArgs = {
         where: expectedWhereClause,
         skip: 15,
         take: 5,
         include: {
            categories: true,
         },
         orderBy: { updatedAt: "desc" },
      };
      const expedtedCountArgs: Prompt0CountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt0.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt0.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.count).toHaveBeenCalledWith(expedtedCountArgs);
   });

   test("pGetPromptDescriptors - query.filter defined - test", async () => {
      const userId = "user-id-123";
      const prompts = ptestData.pPromptDescriptorsWithRelations(21);
      prismaMock.prompt0.findMany.mockResolvedValue(prompts);
      prismaMock.prompt0.count.mockResolvedValue(prompts.length);

      const query: DPrompt0sPageQuery = {
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

      const expectedDbResult: Prompt0sPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
      const expectedResult = toDPromptDescriptorsPage(expectedDbResult);
      const expectedWhereClause: Prompt0WhereInput = {
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
      const expectedFindManyArgs: Prompt0FindManyArgs = {
         where: expectedWhereClause,
         skip: 15,
         take: 5,
         include: {
            categories: true,
         },
         orderBy: { updatedAt: "desc" },
      };
      const expedtedCountArgs: Prompt0CountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt0.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt0.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.count).toHaveBeenCalledWith(expedtedCountArgs);
   });

   test("pGetPromptDescriptors - query defined - test", async () => {
      const userId = "user-id-456";
      const prompts = ptestData.pPromptDescriptorsWithRelations(21);
      prismaMock.prompt0.findMany.mockResolvedValue(prompts);
      prismaMock.prompt0.count.mockResolvedValue(prompts.length);

      const query: DPrompt0sPageQuery = {
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

      const expectedDbResult: Prompt0sPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
      const expectedResult = toDPromptDescriptorsPage(expectedDbResult);
      const expectedWhereClause: Prompt0WhereInput = {
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
      const expectedFindManyArgs: Prompt0FindManyArgs = {
         where: expectedWhereClause,
         skip: 15,
         take: 5,
         include: {
            categories: true,
         },
         orderBy: { updatedAt: "desc" },
      };
      const expedtedCountArgs: Prompt0CountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt0.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt0.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.count).toHaveBeenCalledWith(expedtedCountArgs);
   });
});

describe("pGetPromptDescriptor tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetPromptDescriptor - prompt found - test", async () => {
      const prompt = ptestData.pPromptDescriptorWithRelations();
      prismaMock.prompt0.findFirst.mockResolvedValue(prompt);

      const promptId = "1";
      const userId = "user-id-1";
      const result = await promptRepository.pGetPromptDescriptor(
         userId,
         promptId
      );

      const expectedResult = toDPromptDescriptor(prompt);

      const expectedWhere: Prompt0FindFirstArgs = {
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
      expect(prismaMock.prompt0.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.findFirst).toHaveBeenCalledWith(expectedWhere);
   });

   test("pGetPromptDescriptor - prompt not found (wrong user) - test", async () => {
      prismaMock.prompt0.findFirst.mockResolvedValue(null);

      const promptId = "1";
      const userId = "other-user-id";
      const result = await promptRepository.pGetPromptDescriptor(
         userId,
         promptId
      );

      const expectedWhere: Prompt0FindFirstArgs = {
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
      expect(prismaMock.prompt0.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.findFirst).toHaveBeenCalledWith(expectedWhere);
   });
});

describe("getPromptCategories queries tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("getPromptCategories - categories retrieved - test", async () => {
      const categories = ptestData.pPrompt0Categories();
      prismaMock.prompt0Category.findMany.mockResolvedValue(categories);

      const userId = "user-id-1";
      const result = await promptRepository.pGetPromptCategories(userId);

      const expectedFindMayArgs: Prompt0CategoryFindManyArgs = {
         where: { userId },
         select: {
            name: true,
         },
      };

      expect(result).toEqual(categories);
      expect(prismaMock.prompt0Category.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0Category.findMany).toHaveBeenCalledWith(
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
      const data = dtestData.dPrompt0Update();
      const created = ptestData.pPromptDescriptor();
      prismaMock.prompt0.create.mockResolvedValue(created);

      const result = await promptRepository.pCreatePrompt(userId, data);

      const expectedCreateArgs: Prompt0CreateArgs = {
         data: {
            title: data.title,
            content: data.content,
            recommendedModel: data.recommendedModel,
            currentVersion: 0,
            categories: {
               connectOrCreate: [
                  {
                     where: { userId_name: { userId, name: "category 1" } },
                     create: { name: "category 1", userId },
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
      expect(prismaMock.prompt0.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.create).toHaveBeenCalledWith(
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
      const data = dtestData.dPrompt0Update();
      const current = dtestData.dPrompt0();
      current.currentVersion = 1;
      const updated = ptestData.pPromptDescriptor();
      prismaMock.prompt0.update.mockResolvedValue(updated);

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

      const expectedUpdateArgs: Prompt0UpdateArgs = {
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
                     where: { userId_name: { userId, name: "category 1" } },
                     create: { name: "category 1", userId },
                  },
               ],
            },
            followUpPrompts: expectedFollowUpUpdates,
            versions: undefined,
         },
      };

      expect(result).toEqual(updated);
      expect(prismaMock.prompt0.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });

   test("pUpdatePrompt - version created - test", async () => {
      const userId = "user-id-1";
      const promptId = "prompt-id-1";
      const data = dtestData.dPrompt0Update();
      const current = dtestData.dPrompt0();
      current.currentVersion = 1;
      const updated = ptestData.pPromptDescriptor();
      prismaMock.prompt0.update.mockResolvedValue(updated);

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

      const expectedUpdateArgs: Prompt0UpdateArgs = {
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
                     where: { userId_name: { userId, name: "category 1" } },
                     create: { name: "category 1", userId },
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
      expect(prismaMock.prompt0.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.update).toHaveBeenCalledWith(
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

      const expectedUpdateArgs: Prompt0UpdateArgs = {
         where: { id: promptId, userId },
         data: { isFavorite: true },
      };

      expect(prismaMock.prompt0.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });

   test("pToggleFavorite - isFavorite false - test", async () => {
      const promptId = "prompt-id-1";
      const userId = "user-id-1";

      await promptRepository.pToggleFavorite(userId, promptId, false);

      const expectedUpdateArgs: Prompt0UpdateArgs = {
         where: { id: promptId, userId },
         data: { isFavorite: false },
      };

      expect(prismaMock.prompt0.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.update).toHaveBeenCalledWith(
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

      const expectedArgs: Prompt0DeleteArgs = {
         where: { id: promptId, userId },
      };

      expect(prismaMock.prompt0.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt0.delete).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("followUpPromptUpdates tests", () => {
   const id0 = "f23c15c7-7d2d-40a2-a895-6a78516b9b30";
   const id1 = "f23c15c7-7d2d-40a2-a895-6a78516b9b31";
   const id2 = "f23c15c7-7d2d-40a2-a895-6a78516b9b32";

   it("all new follow-ups (no ids) - existing deleted - test", () => {
      const current = dtestData.dPrompt0();
      const promptUpdate = dtestData.dPrompt0Update();

      const result = promptRepository.followUpPromptUpdates(
         current,
         promptUpdate
      );

      const expectedResult: Prompt0FollowUpUpdateManyWithoutPromptNestedInput =
         {
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
      const current = dtestData.dPrompt0();
      const promptUpdate = dtestData.dPrompt0Update();
      promptUpdate.followUpPrompts = [
         { id: id0, content: "updated 0", order: 0 },
         { id: id1, content: "updated 1", order: 1 },
         { id: id2, content: "updated 2", order: 2 },
      ];

      const result = promptRepository.followUpPromptUpdates(
         current,
         promptUpdate
      );

      const expectedResult: Prompt0FollowUpUpdateManyWithoutPromptNestedInput =
         {
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
      const current = dtestData.dPrompt0();
      const promptUpdate = dtestData.dPrompt0Update();
      promptUpdate.followUpPrompts = [];

      const result = promptRepository.followUpPromptUpdates(
         current,
         promptUpdate
      );

      const expectedResult: Prompt0FollowUpUpdateManyWithoutPromptNestedInput =
         {
            update: undefined,
            create: undefined,
            deleteMany: { id: { in: [id0, id1, id2] } },
         };

      expect(result).toEqual(expectedResult);
   });

   it("mix: 2 updated + 1 new + 1 deleted - test", () => {
      const current = dtestData.dPrompt0();
      const promptUpdate = dtestData.dPrompt0Update();
      promptUpdate.followUpPrompts = [
         { id: id0, content: "updated 0", order: 0 },
         { id: id1, content: "updated 1", order: 1 },
         { content: "new follow up", order: 2 },
      ];

      const result = promptRepository.followUpPromptUpdates(
         current,
         promptUpdate
      );

      const expectedResult: Prompt0FollowUpUpdateManyWithoutPromptNestedInput =
         {
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
      const current = dtestData.dPrompt0();
      current.followUpPrompts = [];
      const promptUpdate = dtestData.dPrompt0Update();
      promptUpdate.followUpPrompts = [];

      const result = promptRepository.followUpPromptUpdates(
         current,
         promptUpdate
      );

      const expectedResult: Prompt0FollowUpUpdateManyWithoutPromptNestedInput =
         {
            update: undefined,
            create: undefined,
            deleteMany: undefined,
         };

      expect(result).toEqual(expectedResult);
   });

   it("no existing follow-ups, add new - test", () => {
      const current = dtestData.dPrompt0();
      current.followUpPrompts = [];
      const promptUpdate = dtestData.dPrompt0Update();
      promptUpdate.followUpPrompts = [
         { content: "new 1", order: 0 },
         { content: "new 2", order: 1 },
      ];

      const result = promptRepository.followUpPromptUpdates(
         current,
         promptUpdate
      );

      const expectedResult: Prompt0FollowUpUpdateManyWithoutPromptNestedInput =
         {
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
