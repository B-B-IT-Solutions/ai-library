import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { flatMap, map, uniq } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   DPromptCategoriesPage,
   DPromptCategoryUsage,
   DPromptPreviewsPage,
   DPromptPreviewsPageQuery,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptVariableType,
   DPromptVariableUpdate,
} from "@/data/types/domain/prompt";
import { Prisma } from "@/generated/prisma/client";
import {
   PromptCategoryCountArgs,
   PromptCategoryDeleteArgs,
   PromptCategoryFindFirstArgs,
   PromptCategoryFindManyArgs,
   PromptCategoryUpdateArgs,
   PromptCountArgs,
   PromptCreateArgs,
   PromptCreateInput,
   PromptDeleteArgs,
   PromptFindFirstArgs,
   PromptFindManyArgs,
   PromptUpdateArgs,
   PromptUpdateInput,
   PromptWhereInput,
} from "@/generated/prisma/models";

import {
   toDPrompt,
   toDPromptCategoryUsages,
   toDPromptPreviews,
   toDPrompts,
   toDPromptWithContent,
} from "./prompt.mapper";
import { PromptRepository } from "./prompt.user.repository";
import { resolveCategoriesWhereInput } from "./utils";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const repository = new PromptRepository(prismaMock);

describe("pGetPromptsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("query undefined - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptsWithCategories();
      const totalEntries = 15;
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);
      prismaMock.prompt.count.mockResolvedValue(totalEntries);

      const result = await repository.pGetPromptsPage(userId);

      const expectedResult: DPromptsPage = {
         content: toDPrompts(descriptors),
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: descriptors.length,
         totalPages: Math.ceil(totalEntries / 20),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: { userId },
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptCountArgs = {
         where: { userId },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("sort createdAt asc - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptsWithCategories();
      const totalEntries = 25;
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);
      prismaMock.prompt.count.mockResolvedValue(totalEntries);

      const query: DPromptsPageQuery = {
         pagination: { pageNumber: 2, pageSize: 10 },
         sort: { field: "createdAt", order: "asc" },
      };

      const result = await repository.pGetPromptsPage(userId, query);

      const expectedResult: DPromptsPage = {
         content: toDPrompts(descriptors),
         pageNumber: 2,
         pageSize: 10,
         numberOfElements: descriptors.length,
         totalPages: Math.ceil(totalEntries / 10),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: { userId },
         include: {
            categories: true,
         },
         orderBy: { createdAt: "asc" },
         skip: 20,
         take: 10,
      };

      const expectedCountArgs: PromptCountArgs = {
         where: { userId },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("sort title asc - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptsWithCategories();
      const totalEntries = 0;
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);
      prismaMock.prompt.count.mockResolvedValue(totalEntries);

      const query: DPromptsPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         sort: { field: "title", order: "asc" },
      };

      const result = await repository.pGetPromptsPage(userId, query);

      const expectedResult: DPromptsPage = {
         content: toDPrompts(descriptors),
         pageNumber: 0,
         pageSize: 10,
         numberOfElements: descriptors.length,
         totalPages: Math.ceil(totalEntries / 10),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: { userId },
         include: {
            categories: true,
         },
         orderBy: { title: "asc" },
         skip: 0,
         take: 10,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: { userId },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("sort title desc - test", async () => {
      const userId = "user-id-1";
      const prompts = ptestData.pPromptsWithCategories();
      const totalEntries = 35;
      prismaMock.prompt.findMany.mockResolvedValue(prompts);
      prismaMock.prompt.count.mockResolvedValue(totalEntries);

      const query: DPromptsPageQuery = {
         pagination: { pageNumber: 2, pageSize: 10 },
         sort: { field: "title", order: "desc" },
      };

      const result = await repository.pGetPromptsPage(userId, query);

      const expectedResult: DPromptsPage = {
         content: toDPrompts(prompts),
         pageNumber: 2,
         pageSize: 10,
         numberOfElements: prompts.length,
         totalPages: Math.ceil(totalEntries / 10),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: { userId },
         include: {
            categories: true,
         },
         orderBy: { title: "desc" },
         skip: 20,
         take: 10,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: { userId },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });
});

describe("pGetPromptPreviewsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("query undefined - test", async () => {
      const userId = "user-id-1";
      const prompts = ptestData.pPromptPreviews();
      const totalEntries = 15;
      prismaMock.prompt.findMany.mockResolvedValue(prompts);
      prismaMock.prompt.count.mockResolvedValue(totalEntries);

      const result = await repository.pGetPromptPreviewsPage(userId);

      const expectedResult: DPromptPreviewsPage = {
         content: toDPromptPreviews(prompts),
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: prompts.length,
         totalPages: Math.ceil(totalEntries / 20),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: { userId },
         select: {
            id: true,
            title: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptCountArgs = {
         where: { userId },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("sort createdAt asc - test", async () => {
      const userId = "user-id-1";
      const prompts = ptestData.pPromptPreviews();
      const totalEntries = 25;
      prismaMock.prompt.findMany.mockResolvedValue(prompts);
      prismaMock.prompt.count.mockResolvedValue(totalEntries);

      const query: DPromptsPageQuery = {
         pagination: { pageNumber: 2, pageSize: 10 },
         sort: { field: "createdAt", order: "asc" },
      };

      const result = await repository.pGetPromptPreviewsPage(userId, query);

      const expectedResult: DPromptPreviewsPage = {
         content: toDPromptPreviews(prompts),
         pageNumber: 2,
         pageSize: 10,
         numberOfElements: prompts.length,
         totalPages: Math.ceil(totalEntries / 10),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: { userId },
         select: {
            id: true,
            title: true,
         },
         orderBy: { createdAt: "asc" },
         skip: 20,
         take: 10,
      };

      const expectedCountArgs: PromptCountArgs = {
         where: { userId },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("sort title asc - test", async () => {
      const userId = "user-id-1";
      const prompts = ptestData.pPromptPreviews();
      const totalEntries = 0;
      prismaMock.prompt.findMany.mockResolvedValue(prompts);
      prismaMock.prompt.count.mockResolvedValue(totalEntries);

      const query: DPromptPreviewsPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         sort: { field: "title", order: "asc" },
      };

      const result = await repository.pGetPromptPreviewsPage(userId, query);

      const expectedResult: DPromptPreviewsPage = {
         content: toDPromptPreviews(prompts),
         pageNumber: 0,
         pageSize: 10,
         numberOfElements: prompts.length,
         totalPages: Math.ceil(totalEntries / 10),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: { userId },
         select: {
            id: true,
            title: true,
         },
         orderBy: { title: "asc" },
         skip: 0,
         take: 10,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: { userId },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("sort title desc - test", async () => {
      const userId = "user-id-1";
      const prompts = ptestData.pPromptPreviews();
      const totalEntries = 15;
      prismaMock.prompt.findMany.mockResolvedValue(prompts);
      prismaMock.prompt.count.mockResolvedValue(totalEntries);

      const query: DPromptsPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         sort: { field: "title", order: "desc" },
      };

      const result = await repository.pGetPromptPreviewsPage(userId, query);

      const expectedResult: DPromptPreviewsPage = {
         content: toDPromptPreviews(prompts),
         pageNumber: 0,
         pageSize: 10,
         numberOfElements: prompts.length,
         totalPages: Math.ceil(totalEntries / 10),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: { userId },
         select: {
            id: true,
            title: true,
         },
         orderBy: { title: "desc" },
         skip: 0,
         take: 10,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: { userId },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });
});

describe("resolveWhereInput tests", () => {
   const userId = "user-id-1";

   beforeEach(() => {
      jest.clearAllMocks();

      const descriptors = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);
      prismaMock.prompt.count.mockResolvedValue(0);
   });

   test("resolveWhereInput - no filter - test", async () => {
      await repository.pGetPromptsPage(userId);

      const expectedWhere: PromptWhereInput = { userId };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("resolveWhereInput - search - test", async () => {
      const query: DPromptsPageQuery = {
         filter: {
            search: "test search",
         },
      };
      await repository.pGetPromptsPage(userId, query);

      const expectedWhere: PromptWhereInput = {
         userId,
         OR: [
            {
               title: {
                  contains: "test search",
                  mode: "insensitive",
               },
            },
            {
               description: {
                  contains: "test search",
                  mode: "insensitive",
               },
            },
         ],
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("resolveWhereInput - categories - test", async () => {
      const query: DPromptsPageQuery = {
         filter: {
            categories: ["cat1", "cat2"],
         },
      };
      await repository.pGetPromptsPage(userId, query);

      const expectedWhere: PromptWhereInput = {
         userId,
         categories: { some: { name: { in: ["cat1", "cat2"] } } },
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("resolveWhereInput - models - test", async () => {
      const query: DPromptsPageQuery = {
         filter: {
            models: ["gpt-4", "claude"],
         },
      };
      await repository.pGetPromptsPage(userId, query);

      const expectedWhere: PromptWhereInput = {
         userId,
         recommendedModel: { in: ["gpt-4", "claude"] },
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("resolveWhereInput - isFavorite true - test", async () => {
      const query: DPromptsPageQuery = {
         filter: {
            isFavorite: true,
         },
      };
      await repository.pGetPromptsPage(userId, query);

      const expectedWhere: PromptWhereInput = {
         userId,
         isFavorite: true,
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("resolveWhereInput - isFavorite false - test", async () => {
      const query: DPromptsPageQuery = {
         filter: {
            isFavorite: false,
         },
      };
      await repository.pGetPromptsPage(userId, query);

      const expectedWhere: PromptWhereInput = {
         userId,
         isFavorite: false,
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("resolveWhereInput - collectionIds - test", async () => {
      const query: DPromptsPageQuery = {
         filter: {
            collectionIds: ["col-1", "col-2"],
         },
      };
      await repository.pGetPromptsPage(userId, query);

      const expectedWhere: PromptWhereInput = {
         userId,
         collectionEntries: {
            some: { collectionId: { in: ["col-1", "col-2"] } },
         },
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("resolveWhereInput - empty arrays - test", async () => {
      const query: DPromptsPageQuery = {
         filter: {
            categories: [],
            models: [],
            collectionIds: [],
         },
      };
      await repository.pGetPromptsPage(userId, query);

      const expectedWhere: PromptWhereInput = {
         userId,
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("resolveWhereInput - full filter - test", async () => {
      const filter = dtestData.dPromptsFilter();
      const query: DPromptsPageQuery = {
         filter,
      };
      await repository.pGetPromptsPage(userId, query);

      const expectedWhere: PromptWhereInput = {
         userId,
         OR: [
            {
               title: {
                  contains: filter.search,
                  mode: "insensitive",
               },
            },
            {
               description: {
                  contains: filter.search,
                  mode: "insensitive",
               },
            },
         ],
         categories: {
            some: { name: { in: filter.categories } },
         },
         recommendedModel: { in: filter.models },
         isFavorite: filter.isFavorite,
         collectionEntries: {
            some: { collectionId: { in: filter.collectionIds } },
         },
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });
});

describe("pGetPrompt tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("prompt null - test", async () => {
      prismaMock.prompt.findFirst.mockResolvedValue(null);

      const userId = "user-id-1";
      const id = "prompt-template-descriptor-id-1";
      const result = await repository.pGetPrompt(userId, id);

      const expectedWhere: PromptFindFirstArgs = {
         where: { id, userId },
         include: {
            categories: true,
         },
      };
      expect(result).toBeNull();
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledWith(expectedWhere);
   });

   test("prompt retrieved - test", async () => {
      const prompt = ptestData.pPromptWithTemplate();
      prismaMock.prompt.findFirst.mockResolvedValue(prompt);

      const userId = "user-id-1";
      const id = "prompt-template-descriptor-id-1";
      const result = await repository.pGetPrompt(userId, id);

      const expectedResult = toDPrompt(prompt);

      const expectedWhere: PromptFindFirstArgs = {
         where: { id, userId },
         include: {
            categories: true,
         },
      };
      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledWith(expectedWhere);
   });
});

describe("pGetPromptContent tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("prompt null - test", async () => {
      prismaMock.prompt.findFirst.mockResolvedValue(null);

      const userId = "user-id-1";
      const id = "prompt-template-id-1";
      const result = await repository.pGetPromptContent(userId, id);

      const expectedWhere: PromptFindFirstArgs = {
         where: { id, userId },
         include: {
            content: true,
            categories: true,
            fields: true,
            globalFields: true,
         },
      };
      expect(result).toBeNull();
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledWith(expectedWhere);
   });

   test("prompt retrieved - test", async () => {
      const prompt = ptestData.pPromptWithContent();
      prismaMock.prompt.findFirst.mockResolvedValue(prompt);

      const userId = "user-id-1";
      const id = "prompt-template-id-1";
      const result = await repository.pGetPromptContent(userId, id);
      const expectedResult = toDPromptWithContent(prompt);

      const expectedWhere: PromptFindFirstArgs = {
         where: { id, userId },
         include: {
            content: true,
            categories: true,
            fields: true,
            globalFields: true,
         },
      };
      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledWith(expectedWhere);
   });
});

describe("pGetPromptCategoriesPage tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("query undefined - test", async () => {
      const userId = "user-id-1";
      const categories = dtestData.dPromptCategories(3);
      const categoryNames = map(categories, (c) => c.name);
      const totalEntries = 15;
      prismaMock.promptCategory.findMany.mockResolvedValue(categories);
      prismaMock.promptCategory.count.mockResolvedValue(totalEntries);

      const result = await repository.pGetPromptCategoriesPage(userId);

      const expectedResult: DPromptCategoriesPage = {
         content: categoryNames,
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: categoryNames.length,
         totalPages: Math.ceil(totalEntries / 20),
         totalElements: totalEntries,
      };

      const expectedWhere = resolveCategoriesWhereInput(userId);
      const expectedFindManyArgs: PromptCategoryFindManyArgs = {
         where: expectedWhere,
         select: {
            name: true,
         },
         orderBy: { name: "asc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptCategoryCountArgs = {
         where: expectedWhere,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptCategory.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptCategory.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("query defined - test", async () => {
      const userId = "user-id-1";
      const categories = dtestData.dPromptCategories(1);
      const categoryNames = map(categories, (c) => c.name);
      const totalEntries = 10;
      prismaMock.promptCategory.findMany.mockResolvedValue(categories);
      prismaMock.promptCategory.count.mockResolvedValue(totalEntries);

      const query = dtestData.dPromptCategoriesPageQuery();

      const result = await repository.pGetPromptCategoriesPage(userId, query);

      const expectedResult: DPromptCategoriesPage = {
         content: categoryNames,
         pageNumber: 1,
         pageSize: 10,
         numberOfElements: categoryNames.length,
         totalPages: Math.ceil(totalEntries / 10),
         totalElements: totalEntries,
      };

      const expectedWhere = resolveCategoriesWhereInput(userId, query.filter);

      const expectedFindManyArgs: PromptCategoryFindManyArgs = {
         where: expectedWhere,
         select: {
            name: true,
         },
         orderBy: { name: "asc" },
         skip: 10,
         take: 10,
      };

      const expectedCountArgs: PromptCategoryCountArgs = {
         where: expectedWhere,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptCategory.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptCategory.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });
});

describe("pGetPromptCategories tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("categories retrieved - test", async () => {
      const userId = "user-id-1";
      const categories = ptestData.pPromptCategories();
      prismaMock.promptCategory.findMany.mockResolvedValue(categories);

      const result = await repository.pGetPromptCategories(userId);

      const expectedFindMayArgs: Prisma.PromptCategoryFindManyArgs = {
         where: { userId },
         select: {
            name: true,
         },
         orderBy: {
            name: "asc",
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

   test("prompt created - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptUpdate();
      const newDescriptor = ptestData.pPromptWithCategories();
      prismaMock.prompt.create.mockResolvedValue(newDescriptor);

      const result = await repository.pCreatePrompt(userId, data);

      const expectedResult = toDPrompt(newDescriptor);

      const expectedInput: PromptCreateInput = {
         title: data.title,
         description: data.description,
         recommendedModel: data.recommendedModel,
         categories: {
            connectOrCreate: map(data.categories, (catName: string) => ({
               where: {
                  userId_name: { userId, name: catName },
               },
               create: {
                  name: catName,
                  userId,
               },
            })),
         },
         content: {
            create: {
               content: data.content,
            },
         },
         fields: {
            create: map(data.fields, (field: DPromptVariableUpdate) => ({
               name: field.name,
               label: field.label,
               description: field.description,
               type: field.type,
               required: field.required,
               order: field.order,
               defaultValue: field.defaultValue,
               options: field.options,
            })),
         },
         globalFields: {
            create: map(data.globalFieldIds, (id, idx) => ({
               globalFieldId: id,
               order: idx,
            })),
         },
         user: {
            connect: {
               id: userId,
            },
         },
      };

      const expectedCreateArgs: PromptCreateArgs = {
         data: expectedInput,
         include: {
            categories: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.create).toHaveBeenCalledWith(expectedCreateArgs);
   });
});

describe("pUpdatePrompt tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("prompt updated - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptUpdate();
      const prompt = ptestData.pPromptWithCategories();

      await repository.pUpdatePrompt(userId, prompt.id, data);

      const expectedInput: PromptUpdateInput = {
         title: data.title,
         description: data.description,
         recommendedModel: data.recommendedModel,
         categories: {
            set: [],
            connectOrCreate: map(data.categories, (catName) => ({
               where: { userId_name: { userId, name: catName } },
               create: { name: catName, userId },
            })),
         },
         content: {
            update: {
               content: data.content,
            },
         },
         fields: {
            deleteMany: {},
            create: map(data.fields, (field: DPromptVariableUpdate) => ({
               name: field.name,
               label: field.label,
               description: field.description,
               type: field.type as DPromptVariableType,
               required: field.required,
               order: field.order,
               defaultValue: field.defaultValue,
               options: field.options,
            })),
         },
         globalFields: {
            deleteMany: {},
            create: map(data.globalFieldIds, (id, idx) => ({
               globalFieldId: id,
               order: idx,
            })),
         },
      };

      const expectedUpdateArgs: PromptUpdateArgs = {
         where: { id: prompt.id },
         data: expectedInput,
      };

      expect(prismaMock.prompt.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.update).toHaveBeenCalledWith(expectedUpdateArgs);
   });
});

describe("pDeletePrompt tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("prompt deleted - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "descriptor-id-1";

      await repository.pDeletePrompt(userId, descriptorId);

      const expectedArgs: PromptDeleteArgs = {
         where: { id: descriptorId, userId },
      };

      expect(prismaMock.prompt.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.delete).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pGetPromptsCount tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("prompts count retrieved - test", async () => {
      const userId = "user-id-1";

      await repository.pGetPromptsCount(userId);

      const expectedArgs: PromptCountArgs = {
         where: { userId },
      };

      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pToggleFavorite tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("isFavorite true - test", async () => {
      const descriptorId = "descriptor-id-1";
      const userId = "user-id-1";

      await repository.pToggleFavorite(userId, descriptorId, true);

      const expectedUpdateArgs: PromptUpdateArgs = {
         where: { id: descriptorId, userId },
         data: { isFavorite: true },
      };

      expect(prismaMock.prompt.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.update).toHaveBeenCalledWith(expectedUpdateArgs);
   });

   test("isFavorite false - test", async () => {
      const descriptorId = "descriptor-id-1";
      const userId = "user-id-1";

      await repository.pToggleFavorite(userId, descriptorId, false);

      const expectedUpdateArgs: PromptUpdateArgs = {
         where: { id: descriptorId, userId },
         data: { isFavorite: false },
      };

      expect(prismaMock.prompt.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.update).toHaveBeenCalledWith(expectedUpdateArgs);
   });
});

describe("pGetTemplateCategories tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("categories retrieved - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);

      const result = await repository.pGePromptCategories(userId);

      const expecteCategories = flatMap(descriptors, (d) =>
         map(d.categories, (cat) => cat.name)
      );
      const expectedResult = uniq(expecteCategories).sort();

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: { userId },
         include: {
            categories: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});

describe("pGetTemplateModels tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("models retrieved - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);

      const result = await repository.pGetPromptModels(userId);

      const expecteModels = map(descriptors, (d) => d.recommendedModel);
      const expectedResult = uniq(expecteModels).sort();

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: { userId },
         select: {
            recommendedModel: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});

describe("pGetCategoriesWithUsage tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("categories with usage retrieved - test", async () => {
      const userId = "user-id-1";
      const categories = [
         { id: 1, name: "Marketing", _count: { prompts: 3 } },
         { id: 2, name: "Support", _count: { prompts: 0 } },
      ];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.promptCategory.findMany.mockResolvedValue(categories as any);

      const result = await repository.pGetCategoriesWithUsage(userId);

      const expectedResult: DPromptCategoryUsage[] =
         toDPromptCategoryUsages(categories);

      const expectedArgs: PromptCategoryFindManyArgs = {
         where: { userId },
         select: {
            id: true,
            name: true,
            _count: {
               select: { prompts: true },
            },
         },
         orderBy: { name: "asc" },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptCategory.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.findMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pRenameCategory tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("category renamed - test", async () => {
      const userId = "user-id-1";
      const categoryId = 1;
      const name = "Vertrieb";

      await repository.pRenameCategory(userId, categoryId, name);

      const expectedArgs: PromptCategoryUpdateArgs = {
         where: { id: categoryId, userId },
         data: { name },
      };

      expect(prismaMock.promptCategory.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.update).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pDeleteCategory tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("category deleted - test", async () => {
      const userId = "user-id-1";
      const categoryId = 1;

      await repository.pDeleteCategory(userId, categoryId);

      const expectedArgs: PromptCategoryDeleteArgs = {
         where: { id: categoryId, userId },
      };

      expect(prismaMock.promptCategory.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.delete).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pCategoryNameExists tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("name exists - returns true - test", async () => {
      const userId = "user-id-1";
      const name = "Marketing";
      const excludeCategoryId = 1;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.promptCategory.findFirst.mockResolvedValue({ id: 2 } as any);

      const result = await repository.pCategoryNameExists(
         userId,
         name,
         excludeCategoryId
      );

      const expectedArgs: PromptCategoryFindFirstArgs = {
         where: {
            userId,
            name: { equals: name, mode: "insensitive" },
            id: { not: excludeCategoryId },
         },
         select: { id: true },
      };

      expect(result).toBe(true);
      expect(prismaMock.promptCategory.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.findFirst).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   test("name does not exist - returns false - test", async () => {
      const userId = "user-id-1";
      const name = "Vertrieb";
      const excludeCategoryId = 1;

      prismaMock.promptCategory.findFirst.mockResolvedValue(null);

      const result = await repository.pCategoryNameExists(
         userId,
         name,
         excludeCategoryId
      );

      expect(result).toBe(false);
   });
});
