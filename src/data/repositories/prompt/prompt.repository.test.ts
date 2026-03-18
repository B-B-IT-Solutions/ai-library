import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
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
} from "@/generated/prisma/models";

import { GetPromptQuery, PromptRepository } from "./prompt.repository";

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

      const expectedResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 0,
         pageSize: 10,
         totalElements: 3,
         totalPages: 1,
      };
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

      const expectedResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 0,
         pageSize: 10,
         totalElements: 3,
         totalPages: 1,
      };
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

      const expectedResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
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

      const expectedResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
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

      const expectedResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
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

   test("pGetPromptDescriptor - id defiend - slug undefined - test", async () => {
      const prompt = ptestData.pPromptDescriptorWithRelations();
      prismaMock.promptDescriptor.findFirst.mockResolvedValue(prompt);

      const query: GetPromptQuery = { id: "1" };
      const result = await promptRepository.pGetPromptDescriptor(query);

      const expectedWhere: PromptDescriptorFindFirstArgs = {
         where: {
            id: query.id,
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
      expect(result).toEqual(prompt);
      expect(prismaMock.promptDescriptor.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.findFirst).toHaveBeenCalledWith(
         expectedWhere
      );
   });

   test("pGetPromptDescriptor - id undefiend - slug defined - test", async () => {
      prismaMock.promptDescriptor.findFirst.mockResolvedValue(null);

      const query: GetPromptQuery = { id: "1" };
      const result = await promptRepository.pGetPromptDescriptor(query);

      const expectedWhere: PromptDescriptorFindFirstArgs = {
         where: {
            id: query.id,
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

      const result = await promptRepository.pGetPromptCategories();

      const expectedFindMayArgs: PromptCategoryFindManyArgs = {
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
      const input = ptestData.pPromptDescriptorCreateInput();
      prismaMock.promptDescriptor.create.mockResolvedValue(input);
      const result = await promptRepository.pCreatePrompt(input);

      const expectedCreateArgs: PromptDescriptorCreateArgs = {
         data: input,
      };

      expect(result).toEqual(input);
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

   test("pUpdatePrompt - prompt updated - test", async () => {
      const promptId = "prompt-id-1";
      const input = ptestData.pPromptDescriptorUpdateInput();
      prismaMock.promptDescriptor.update.mockResolvedValue(input);
      const result = await promptRepository.pUpdatePrompt(promptId, input);

      const expectedUpdateArgs: PromptDescriptorUpdateArgs = {
         where: { id: promptId },
         data: input,
      };

      expect(result).toEqual(input);
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

      await promptRepository.pToggleFavorite(promptId, true);

      const expectedUpdateArgs: PromptDescriptorUpdateArgs = {
         where: { id: promptId },
         data: { isFavorite: true },
      };

      expect(prismaMock.promptDescriptor.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });

   test("pToggleFavorite - isFavorite false - test", async () => {
      const promptId = "prompt-id-1";

      await promptRepository.pToggleFavorite(promptId, false);

      const expectedUpdateArgs: PromptDescriptorUpdateArgs = {
         where: { id: promptId },
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

      await promptRepository.pDeletePrompt(promptId);

      const expectedUpdateArgs: PromptDescriptorDeleteArgs = {
         where: { id: promptId },
      };

      expect(prismaMock.promptDescriptor.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptDescriptor.delete).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });
});
