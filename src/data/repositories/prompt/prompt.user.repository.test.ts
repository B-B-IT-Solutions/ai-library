import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   DPromptCategoriesPage,
   DPromptModelsPage,
   DPromptPreviewsPage,
   DPromptPreviewsPageQuery,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptUpdateOptions,
   DPromptVariableType,
   DPromptVariableUpdate,
} from "@/data/types/domain/prompt";
import {
   PromptCategoryCountArgs,
   PromptCategoryCreateArgs,
   PromptCategoryDeleteArgs,
   PromptCategoryFindFirstArgs,
   PromptCategoryFindManyArgs,
   PromptCategoryUpdateArgs,
   PromptContentVersionCountArgs,
   PromptContentVersionFindFirstArgs,
   PromptContentVersionFindManyArgs,
   PromptCountArgs,
   PromptCreateArgs,
   PromptCreateInput,
   PromptDeleteArgs,
   PromptFindFirstArgs,
   PromptFindManyArgs,
   PromptModelCountArgs,
   PromptModelCreateArgs,
   PromptModelDeleteArgs,
   PromptModelFindFirstArgs,
   PromptModelFindManyArgs,
   PromptModelUpdateArgs,
   PromptUpdateArgs,
   PromptUpdateInput,
   PromptWhereInput,
} from "@/generated/prisma/models";

import {
   toDPrompt,
   toDPromptCategoriesWithUsage,
   toDPromptCategoryWithUsage,
   toDPromptModelsWithUsage,
   toDPromptPreviews,
   toDPrompts,
   toDPromptVersion,
   toDPromptVersionSummaries,
   toDPromptWithContent,
} from "./prompt.mapper";
import { PromptRepository } from "./prompt.user.repository";
import { resolveCategoriesWhereInput, resolveModelsWhereInput } from "./utils";

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
            model: true,
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
            model: true,
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
            model: true,
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
            model: true,
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
            model: true,
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
            model: true,
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
            model: true,
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
         model: { name: { in: ["gpt-4", "claude"] } },
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
            model: true,
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
            model: true,
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
            model: true,
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
            model: true,
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
            model: true,
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
         model: { name: { in: filter.models } },
         isFavorite: filter.isFavorite,
         collectionEntries: {
            some: { collectionId: { in: filter.collectionIds } },
         },
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
            model: true,
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
            model: true,
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
            model: true,
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
            model: true,
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
            model: true,
            fields: true,
            globalFields: true,
         },
      };
      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledWith(expectedWhere);
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
         model: {
            connectOrCreate: {
               where: {
                  userId_name: { userId, name: data.model },
               },
               create: {
                  name: data.model,
                  userId,
               },
            },
         },
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
            model: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.create).toHaveBeenCalledWith(expectedCreateArgs);
   });
});

describe("pUpdatePromptWithVersioning tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
      prismaMock.$transaction.mockImplementation((arg: any) => {
         if (Array.isArray(arg)) {
            return Promise.all(arg);
         }
         return arg(prismaMock);
      });
   });

   const expectedUpdateInput = (
      userId: string,
      data: ReturnType<typeof dtestData.dPromptUpdate>
   ): PromptUpdateInput => ({
      title: data.title,
      description: data.description,
      model: {
         connectOrCreate: {
            where: { userId_name: { userId, name: data.model } },
            create: { name: data.model, userId },
         },
      },
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
   });

   test("no versionOptions - updates prompt, no version created - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptUpdate();
      const prompt = ptestData.pPromptWithCategories();

      await repository.pUpdatePromptWithVersioning(userId, prompt.id, data);

      const expectedUpdateArgs: PromptUpdateArgs = {
         where: { id: prompt.id },
         data: expectedUpdateInput(userId, data),
      };

      expect(prismaMock.prompt.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.update).toHaveBeenCalledWith(expectedUpdateArgs);
      expect(prismaMock.promptContentVersion.create).not.toHaveBeenCalled();
   });

   test("saveAsVersion false - updates prompt, no version created - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptUpdate();
      const prompt = ptestData.pPromptWithCategories();
      const versionOptions: DPromptUpdateOptions = { saveAsVersion: false };

      await repository.pUpdatePromptWithVersioning(
         userId,
         prompt.id,
         data,
         versionOptions
      );

      expect(prismaMock.prompt.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptContentVersion.create).not.toHaveBeenCalled();
   });

   test("saveAsVersion true - archives PREVIOUS content, then updates prompt - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptUpdate();
      const prompt = ptestData.pPromptWithCategories();
      const currentContent = ptestData.pPromptContent();
      const versionOptions: DPromptUpdateOptions = {
         saveAsVersion: true,
         versionNote: "Vor Ton-Anpassung gesichert",
      };

      prismaMock.promptContent.findUnique.mockResolvedValue(currentContent);
      prismaMock.promptContentVersion.findFirst.mockResolvedValue(null);

      await repository.pUpdatePromptWithVersioning(
         userId,
         prompt.id,
         data,
         versionOptions
      );

      expect(prismaMock.promptContent.findUnique).toHaveBeenCalledWith({
         where: { promptId: prompt.id },
      });
      expect(prismaMock.promptContentVersion.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptContentVersion.create).toHaveBeenCalledWith({
         data: {
            promptId: prompt.id,
            versionNumber: 1,
            content: currentContent.content, // the PREVIOUS content, not data.content
            note: versionOptions.versionNote,
         },
      });
      expect(prismaMock.prompt.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.update).toHaveBeenCalledWith({
         where: { id: prompt.id },
         data: expectedUpdateInput(userId, data),
      });
   });

   test("saveAsVersion true - versionNumber continues from last version - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptUpdate();
      const prompt = ptestData.pPromptWithCategories();
      const currentContent = ptestData.pPromptContent();
      const lastVersion = ptestData.pPromptContentVersion(4);
      const versionOptions: DPromptUpdateOptions = { saveAsVersion: true };

      prismaMock.promptContent.findUnique.mockResolvedValue(currentContent);
      prismaMock.promptContentVersion.findFirst.mockResolvedValue(lastVersion);

      await repository.pUpdatePromptWithVersioning(
         userId,
         prompt.id,
         data,
         versionOptions
      );

      expect(prismaMock.promptContentVersion.create).toHaveBeenCalledWith({
         data: {
            promptId: prompt.id,
            versionNumber: lastVersion.versionNumber + 1,
            content: currentContent.content,
            note: null,
         },
      });
   });

   test("saveAsVersion true - no versionNote - stores null note - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptUpdate();
      const prompt = ptestData.pPromptWithCategories();
      const currentContent = ptestData.pPromptContent();
      const versionOptions: DPromptUpdateOptions = { saveAsVersion: true };

      prismaMock.promptContent.findUnique.mockResolvedValue(currentContent);
      prismaMock.promptContentVersion.findFirst.mockResolvedValue(null);

      await repository.pUpdatePromptWithVersioning(
         userId,
         prompt.id,
         data,
         versionOptions
      );

      expect(prismaMock.promptContentVersion.create).toHaveBeenCalledWith(
         expect.objectContaining({ data: expect.objectContaining({ note: null }) })
      );
   });

   test("saveAsVersion true - no existing PromptContent - skips archiving - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptUpdate();
      const prompt = ptestData.pPromptWithCategories();
      const versionOptions: DPromptUpdateOptions = { saveAsVersion: true };

      prismaMock.promptContent.findUnique.mockResolvedValue(null);

      await repository.pUpdatePromptWithVersioning(
         userId,
         prompt.id,
         data,
         versionOptions
      );

      expect(prismaMock.promptContentVersion.create).not.toHaveBeenCalled();
      expect(prismaMock.prompt.update).toHaveBeenCalledTimes(1);
   });

   test("saveAsVersion true - rotation - deletes oldest versions beyond maxStoredVersions - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptUpdate();
      const prompt = ptestData.pPromptWithCategories();
      const currentContent = ptestData.pPromptContent();
      const versionOptions: DPromptUpdateOptions = { saveAsVersion: true };
      const maxStoredVersions = 20;
      const oldestVersions = [{ id: "v-1" }, { id: "v-2" }];

      prismaMock.promptContent.findUnique.mockResolvedValue(currentContent);
      prismaMock.promptContentVersion.findFirst.mockResolvedValue(null);
      prismaMock.promptContentVersion.count.mockResolvedValue(22);
      prismaMock.promptContentVersion.findMany.mockResolvedValue(
         oldestVersions as never
      );

      await repository.pUpdatePromptWithVersioning(
         userId,
         prompt.id,
         data,
         versionOptions,
         maxStoredVersions
      );

      expect(prismaMock.promptContentVersion.count).toHaveBeenCalledWith({
         where: { promptId: prompt.id },
      });
      expect(prismaMock.promptContentVersion.findMany).toHaveBeenCalledWith({
         where: { promptId: prompt.id },
         orderBy: { versionNumber: "asc" },
         take: 2,
         select: { id: true },
      });
      expect(prismaMock.promptContentVersion.deleteMany).toHaveBeenCalledWith({
         where: { id: { in: ["v-1", "v-2"] } },
      });
   });

   test("saveAsVersion true - within maxStoredVersions - no rotation - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptUpdate();
      const prompt = ptestData.pPromptWithCategories();
      const currentContent = ptestData.pPromptContent();
      const versionOptions: DPromptUpdateOptions = { saveAsVersion: true };
      const maxStoredVersions = 20;

      prismaMock.promptContent.findUnique.mockResolvedValue(currentContent);
      prismaMock.promptContentVersion.findFirst.mockResolvedValue(null);
      prismaMock.promptContentVersion.count.mockResolvedValue(5);

      await repository.pUpdatePromptWithVersioning(
         userId,
         prompt.id,
         data,
         versionOptions,
         maxStoredVersions
      );

      expect(prismaMock.promptContentVersion.deleteMany).not.toHaveBeenCalled();
   });

   test("saveAsVersion true - maxStoredVersions -1 (unlimited) - no rotation attempted - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptUpdate();
      const prompt = ptestData.pPromptWithCategories();
      const currentContent = ptestData.pPromptContent();
      const versionOptions: DPromptUpdateOptions = { saveAsVersion: true };

      prismaMock.promptContent.findUnique.mockResolvedValue(currentContent);
      prismaMock.promptContentVersion.findFirst.mockResolvedValue(null);

      await repository.pUpdatePromptWithVersioning(
         userId,
         prompt.id,
         data,
         versionOptions,
         -1
      );

      expect(prismaMock.promptContentVersion.count).not.toHaveBeenCalled();
      expect(prismaMock.promptContentVersion.deleteMany).not.toHaveBeenCalled();
   });
});

describe("pRestorePromptContent tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
      prismaMock.$transaction.mockImplementation((arg: any) => {
         if (Array.isArray(arg)) {
            return Promise.all(arg);
         }
         return arg(prismaMock);
      });
   });

   test("saveAsVersion false - only updates content, no version archived - test", async () => {
      const prompt = ptestData.pPromptWithCategories();
      const newContent = "restored content";

      await repository.pRestorePromptContent(prompt.id, newContent);

      expect(prismaMock.promptContentVersion.create).not.toHaveBeenCalled();
      expect(prismaMock.promptContent.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptContent.update).toHaveBeenCalledWith({
         where: { promptId: prompt.id },
         data: { content: newContent },
      });
      expect(prismaMock.prompt.update).not.toHaveBeenCalled();
   });

   test("saveAsVersion true - archives current content, then restores - test", async () => {
      const prompt = ptestData.pPromptWithCategories();
      const currentContent = ptestData.pPromptContent();
      const newContent = "restored content";
      const versionOptions: DPromptUpdateOptions = {
         saveAsVersion: true,
         versionNote: "Automatisch gesichert vor Wiederherstellen von Version 2",
      };

      prismaMock.promptContent.findUnique.mockResolvedValue(currentContent);
      prismaMock.promptContentVersion.findFirst.mockResolvedValue(null);

      await repository.pRestorePromptContent(
         prompt.id,
         newContent,
         versionOptions,
         20
      );

      expect(prismaMock.promptContentVersion.create).toHaveBeenCalledWith({
         data: {
            promptId: prompt.id,
            versionNumber: 1,
            content: currentContent.content,
            note: versionOptions.versionNote,
         },
      });
      expect(prismaMock.promptContent.update).toHaveBeenCalledWith({
         where: { promptId: prompt.id },
         data: { content: newContent },
      });
      // Restore never touches title/description/model/categories/fields
      expect(prismaMock.prompt.update).not.toHaveBeenCalled();
   });
});

describe("pGetPromptVersionsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("query undefined - defaults pagination - test", async () => {
      const promptId = "prompt-id-1";
      const versions = ptestData.pPromptContentVersions();
      const totalEntries = 4;

      prismaMock.promptContentVersion.findMany.mockResolvedValue(versions);
      prismaMock.promptContentVersion.count.mockResolvedValue(totalEntries);

      const result = await repository.pGetPromptVersionsPage(promptId);

      const expectedFindManyArgs: PromptContentVersionFindManyArgs = {
         where: { promptId },
         select: {
            id: true,
            promptId: true,
            versionNumber: true,
            note: true,
            createdAt: true,
         },
         orderBy: { versionNumber: "desc" },
         skip: 0,
         take: 20,
      };
      const expectedCountArgs: PromptContentVersionCountArgs = {
         where: { promptId },
      };

      expect(result).toEqual({
         content: toDPromptVersionSummaries(versions),
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: versions.length,
         totalPages: Math.ceil(totalEntries / 20),
         totalElements: totalEntries,
      });
      expect(prismaMock.promptContentVersion.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptContentVersion.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("custom pagination - test", async () => {
      const promptId = "prompt-id-1";
      const versions = ptestData.pPromptContentVersions(2);

      prismaMock.promptContentVersion.findMany.mockResolvedValue(versions);
      prismaMock.promptContentVersion.count.mockResolvedValue(2);

      await repository.pGetPromptVersionsPage(promptId, {
         pageNumber: 1,
         pageSize: 5,
      });

      expect(prismaMock.promptContentVersion.findMany).toHaveBeenCalledWith(
         expect.objectContaining({ skip: 5, take: 5 })
      );
   });
});

describe("pGetPromptVersion tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("version found - test", async () => {
      const userId = "user-id-1";
      const promptId = "prompt-id-1";
      const version = ptestData.pPromptContentVersion();

      prismaMock.promptContentVersion.findFirst.mockResolvedValue(version);

      const result = await repository.pGetPromptVersion(
         userId,
         promptId,
         version.id
      );

      const expectedArgs: PromptContentVersionFindFirstArgs = {
         where: {
            id: version.id,
            promptId,
            prompt: { userId },
         },
      };

      expect(result).toEqual(toDPromptVersion(version));
      expect(prismaMock.promptContentVersion.findFirst).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   test("version not found - test", async () => {
      const userId = "user-id-1";
      const promptId = "prompt-id-1";

      prismaMock.promptContentVersion.findFirst.mockResolvedValue(null);

      const result = await repository.pGetPromptVersion(
         userId,
         promptId,
         "missing-version-id"
      );

      expect(result).toBeNull();
   });
});

describe("pGetLatestPromptVersionContent tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("version exists - returns content - test", async () => {
      const promptId = "prompt-id-1";
      const version = ptestData.pPromptContentVersion();

      prismaMock.promptContentVersion.findFirst.mockResolvedValue(version);

      const result = await repository.pGetLatestPromptVersionContent(promptId);

      expect(result).toBe(version.content);
      expect(prismaMock.promptContentVersion.findFirst).toHaveBeenCalledWith({
         where: { promptId },
         orderBy: { versionNumber: "desc" },
         select: { content: true },
      });
   });

   test("no versions - returns null - test", async () => {
      const promptId = "prompt-id-1";

      prismaMock.promptContentVersion.findFirst.mockResolvedValue(null);

      const result = await repository.pGetLatestPromptVersionContent(promptId);

      expect(result).toBeNull();
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

      const expectedResult = map(categories, (c) => c.name);

      const expectedFindManyArgs: PromptCategoryFindManyArgs = {
         where: { userId },
         select: {
            name: true,
         },
         orderBy: {
            name: "asc",
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptCategory.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});

describe("pGetCategoriesWithUsage tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("categories retrieved - test", async () => {
      const userId = "user-id-1";
      const categories = ptestData.pPromptCategoriesWithUsage();

      prismaMock.promptCategory.findMany.mockResolvedValue(categories);

      const result = await repository.pGetPromptCategoriesWithUsage(userId);

      const expectedResult = toDPromptCategoriesWithUsage(categories);

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

describe("pCreatePromptCategory tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("category created - test", async () => {
      const userId = "user-id-1";

      const update = dtestData.dPromptCategoryWithUsage();

      await repository.pCreatePromptCategory(userId, update);

      const expectedArgs: PromptCategoryCreateArgs = {
         data: {
            userId,
            name: update.name,
         },
      };

      expect(prismaMock.promptCategory.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.create).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pUpdatePromptCategory tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("category renamed - test", async () => {
      const userId = "user-id-1";
      const categoryId = 1;

      const update = dtestData.dPromptCategoryUpdate();
      await repository.pUpdatePromptCategory(userId, categoryId, update);

      const expectedArgs: PromptCategoryUpdateArgs = {
         where: { id: categoryId, userId },
         data: { name: update.name },
      };

      expect(prismaMock.promptCategory.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.update).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pDeletePromptCategory tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("category deleted - test", async () => {
      const userId = "user-id-1";
      const categoryId = 1;

      await repository.pDeletePromptCategory(userId, categoryId);

      const expectedArgs: PromptCategoryDeleteArgs = {
         where: { id: categoryId, userId },
      };

      expect(prismaMock.promptCategory.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.delete).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pPromptCategoryExists tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("name exists - true - test", async () => {
      const userId = "user-id-1";
      const name = "category 1";
      const excludeCategoryId = 1;

      const category = ptestData.pPromptCategory();
      prismaMock.promptCategory.findFirst.mockResolvedValue(category);

      const result = await repository.pPromptCategoryExists(
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

   test("name exists - false - test", async () => {
      const userId = "user-id-1";
      const name = "Vertrieb";
      const excludeCategoryId = 1;

      prismaMock.promptCategory.findFirst.mockResolvedValue(null);

      const result = await repository.pPromptCategoryExists(
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

      expect(result).toBe(false);
      expect(prismaMock.promptCategory.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.findFirst).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   test("excludeCategoryId not provided - id filter omitted - test", async () => {
      const userId = "user-id-1";
      const name = "category 1";

      prismaMock.promptCategory.findFirst.mockResolvedValue(null);

      const result = await repository.pPromptCategoryExists(userId, name);

      const expectedArgs: PromptCategoryFindFirstArgs = {
         where: {
            userId,
            name: { equals: name, mode: "insensitive" },
         },
         select: { id: true },
      };

      expect(result).toBe(false);
      expect(prismaMock.promptCategory.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptCategory.findFirst).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pGetPromptModels tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("models retrieved - test", async () => {
      const userId = "user-id-1";
      const models = ptestData.pPromptModels();
      prismaMock.promptModel.findMany.mockResolvedValue(models);

      const result = await repository.pGetPromptModels(userId);

      const expectedResult = map(models, (m) => m.name);

      const expectedFindManyArgs: PromptModelFindManyArgs = {
         where: { userId },
         select: {
            name: true,
         },
         orderBy: {
            name: "asc",
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptModel.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptModel.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});

describe("pGetPromptModelsPage tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("query undefined - test", async () => {
      const userId = "user-id-1";
      const models = ptestData.pPromptModels(3);
      const modelNames = map(models, (m) => m.name);
      const totalEntries = 15;
      prismaMock.promptModel.findMany.mockResolvedValue(models);
      prismaMock.promptModel.count.mockResolvedValue(totalEntries);

      const result = await repository.pGetPromptModelsPage(userId);

      const expectedResult: DPromptModelsPage = {
         content: modelNames,
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: modelNames.length,
         totalPages: Math.ceil(totalEntries / 20),
         totalElements: totalEntries,
      };

      const expectedWhere = resolveModelsWhereInput(userId);
      const expectedFindManyArgs: PromptModelFindManyArgs = {
         where: expectedWhere,
         select: {
            name: true,
         },
         orderBy: { name: "asc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptModelCountArgs = {
         where: expectedWhere,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptModel.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptModel.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptModel.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptModel.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("query defined - test", async () => {
      const userId = "user-id-1";
      const models = ptestData.pPromptModels(1);
      const modelNames = map(models, (m) => m.name);
      const totalEntries = 10;
      prismaMock.promptModel.findMany.mockResolvedValue(models);
      prismaMock.promptModel.count.mockResolvedValue(totalEntries);

      const query = dtestData.dPromptModelsPageQuery();

      const result = await repository.pGetPromptModelsPage(userId, query);

      const expectedResult: DPromptModelsPage = {
         content: modelNames,
         pageNumber: 1,
         pageSize: 10,
         numberOfElements: modelNames.length,
         totalPages: Math.ceil(totalEntries / 10),
         totalElements: totalEntries,
      };

      const expectedWhere = resolveModelsWhereInput(userId, query.filter);

      const expectedFindManyArgs: PromptModelFindManyArgs = {
         where: expectedWhere,
         select: {
            name: true,
         },
         orderBy: { name: "asc" },
         skip: 10,
         take: 10,
      };

      const expectedCountArgs: PromptModelCountArgs = {
         where: expectedWhere,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptModel.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptModel.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptModel.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptModel.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });
});

describe("pGetPromptModelsWithUsage tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("models retrieved - test", async () => {
      const userId = "user-id-1";
      const models = ptestData.pPromptModelsWithUsage();

      prismaMock.promptModel.findMany.mockResolvedValue(models);

      const result = await repository.pGetPromptModelsWithUsage(userId);

      const expectedResult = toDPromptModelsWithUsage(models);

      const expectedArgs: PromptModelFindManyArgs = {
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
      expect(prismaMock.promptModel.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptModel.findMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pCreatePromptModel tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("model created - test", async () => {
      const userId = "user-id-1";

      const update = dtestData.dPromptModelUpdate();

      await repository.pCreatePromptModel(userId, update);

      const expectedArgs: PromptModelCreateArgs = {
         data: {
            userId,
            name: update.name,
         },
      };

      expect(prismaMock.promptModel.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptModel.create).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pUpdatePromptModel tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("model renamed - test", async () => {
      const userId = "user-id-1";
      const modelId = 1;

      const update = dtestData.dPromptModelUpdate();
      await repository.pUpdatePromptModel(userId, modelId, update);

      const expectedArgs: PromptModelUpdateArgs = {
         where: { id: modelId, userId },
         data: { name: update.name },
      };

      expect(prismaMock.promptModel.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptModel.update).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pDeletePromptModel tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("model deleted - test", async () => {
      const userId = "user-id-1";
      const modelId = 1;

      await repository.pDeletePromptModel(userId, modelId);

      const expectedArgs: PromptModelDeleteArgs = {
         where: { id: modelId, userId },
      };

      expect(prismaMock.promptModel.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptModel.delete).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pPromptModelExists tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("name exists - true - test", async () => {
      const userId = "user-id-1";
      const name = "model 1";
      const excludeModelId = 1;

      const model = ptestData.pPromptModel();
      prismaMock.promptModel.findFirst.mockResolvedValue(model);

      const result = await repository.pPromptModelExists(
         userId,
         name,
         excludeModelId
      );

      const expectedArgs: PromptModelFindFirstArgs = {
         where: {
            userId,
            name: { equals: name, mode: "insensitive" },
            id: { not: excludeModelId },
         },
         select: { id: true },
      };

      expect(result).toBe(true);
      expect(prismaMock.promptModel.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptModel.findFirst).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   test("name exists - false - test", async () => {
      const userId = "user-id-1";
      const name = "GPT-4";
      const excludeModelId = 1;

      prismaMock.promptModel.findFirst.mockResolvedValue(null);

      const result = await repository.pPromptModelExists(
         userId,
         name,
         excludeModelId
      );

      const expectedArgs: PromptModelFindFirstArgs = {
         where: {
            userId,
            name: { equals: name, mode: "insensitive" },
            id: { not: excludeModelId },
         },
         select: { id: true },
      };

      expect(result).toBe(false);
      expect(prismaMock.promptModel.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptModel.findFirst).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   test("excludeModelId not provided - id filter omitted - test", async () => {
      const userId = "user-id-1";
      const name = "model 1";

      prismaMock.promptModel.findFirst.mockResolvedValue(null);

      const result = await repository.pPromptModelExists(userId, name);

      const expectedArgs: PromptModelFindFirstArgs = {
         where: {
            userId,
            name: { equals: name, mode: "insensitive" },
         },
         select: { id: true },
      };

      expect(result).toBe(false);
      expect(prismaMock.promptModel.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptModel.findFirst).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});
