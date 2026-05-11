import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { flatMap, map, uniq } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   DPromptTemplateFieldType,
   DPromptTemplateFieldUpdate,
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";
import { Prisma } from "@/generated/prisma/client";
import {
   PromptTemplateDescriptorCountArgs,
   PromptTemplateDescriptorCreateArgs,
   PromptTemplateDescriptorCreateInput,
   PromptTemplateDescriptorDeleteArgs,
   PromptTemplateDescriptorFindFirstArgs,
   PromptTemplateDescriptorFindManyArgs,
   PromptTemplateDescriptorUpdateArgs,
   PromptTemplateDescriptorUpdateInput,
   PromptTemplateDescriptorWhereInput,
   PromptContentFindFirstArgs,
} from "@/generated/prisma/models";

import {
   toDPromptTemplate,
   toDTemplateDescriptor,
   toDTemplateDescriptors,
} from "./template.mapper";
import { TemplateRepository } from "./template.user.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const repository = new TemplateRepository(prismaMock);

describe("pGetTemplateDescriptorsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetTemplateDescriptorsPage - no query - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptTemplateDescriptorsWithCategories();
      const totalEntries = 15;
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(
         descriptors
      );
      prismaMock.promptTemplateDescriptor.count.mockResolvedValue(totalEntries);

      const result = await repository.pGetTemplateDescriptorsPage(userId);

      const expectedResult: DTemplateDescriptorsPage = {
         content: toDTemplateDescriptors(descriptors),
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: descriptors.length,
         totalPages: Math.ceil(totalEntries / 20),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: { userId },
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptTemplateDescriptorCountArgs = {
         where: { userId },
      };

      expect(result).toEqual(expectedResult);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledTimes(
         1
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("pGetTemplateDescriptorsPage - sort createdAt asc - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptTemplateDescriptorsWithCategories();
      const totalEntries = 25;
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(
         descriptors
      );
      prismaMock.promptTemplateDescriptor.count.mockResolvedValue(totalEntries);

      const query: DTemplateDescriptorsPageQuery = {
         pagination: { pageNumber: 2, pageSize: 10 },
         sort: { field: "createdAt", order: "asc" },
      };

      const result = await repository.pGetTemplateDescriptorsPage(
         userId,
         query
      );

      const expectedResult: DTemplateDescriptorsPage = {
         content: toDTemplateDescriptors(descriptors),
         pageNumber: 2,
         pageSize: 10,
         numberOfElements: descriptors.length,
         totalPages: Math.ceil(totalEntries / 10),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: { userId },
         include: {
            categories: true,
         },
         orderBy: { createdAt: "asc" },
         skip: 20,
         take: 10,
      };

      const expectedCountArgs: PromptTemplateDescriptorCountArgs = {
         where: { userId },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("pGetTemplateDescriptorsPage - sort title asc - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(
         descriptors
      );
      prismaMock.promptTemplateDescriptor.count.mockResolvedValue(0);

      const query: DTemplateDescriptorsPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         sort: { field: "title", order: "asc" },
      };

      await repository.pGetTemplateDescriptorsPage(userId, query);

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: { userId },
         include: {
            categories: true,
         },
         orderBy: { title: "asc" },
         skip: 0,
         take: 10,
      };

      const expectedCountArgs: PromptTemplateDescriptorFindManyArgs = {
         where: { userId },
      };

      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("pGetTemplateDescriptorsPage - sort title desc - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(
         descriptors
      );
      prismaMock.promptTemplateDescriptor.count.mockResolvedValue(0);

      const query: DTemplateDescriptorsPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         sort: { field: "title", order: "desc" },
      };

      await repository.pGetTemplateDescriptorsPage(userId, query);

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: { userId },
         include: {
            categories: true,
         },
         orderBy: { title: "desc" },
         skip: 0,
         take: 10,
      };

      const expectedCountArgs: PromptTemplateDescriptorFindManyArgs = {
         where: { userId },
      };

      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });
});

describe("pGetTemplateDescriptorsPage - resolveWhereInput tests", () => {
   const userId = "user-id-1";

   beforeEach(() => {
      jest.clearAllMocks();

      const descriptors = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(
         descriptors
      );
      prismaMock.promptTemplateDescriptor.count.mockResolvedValue(0);
   });

   test("resolveWhereInput - no filter - test", async () => {
      await repository.pGetTemplateDescriptorsPage(userId);

      const expectedWhere: PromptTemplateDescriptorWhereInput = { userId };

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - search - test", async () => {
      const query: DTemplateDescriptorsPageQuery = {
         filter: {
            search: "test search",
         },
      };
      await repository.pGetTemplateDescriptorsPage(userId, query);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
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

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - categories - test", async () => {
      const query: DTemplateDescriptorsPageQuery = {
         filter: {
            categories: ["cat1", "cat2"],
         },
      };
      await repository.pGetTemplateDescriptorsPage(userId, query);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
         categories: { some: { name: { in: ["cat1", "cat2"] } } },
      };

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - models - test", async () => {
      const query: DTemplateDescriptorsPageQuery = {
         filter: {
            models: ["gpt-4", "claude"],
         },
      };
      await repository.pGetTemplateDescriptorsPage(userId, query);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
         recommendedModel: { in: ["gpt-4", "claude"] },
      };

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - isFavorite true - test", async () => {
      const query: DTemplateDescriptorsPageQuery = {
         filter: {
            isFavorite: true,
         },
      };
      await repository.pGetTemplateDescriptorsPage(userId, query);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
         isFavorite: true,
      };

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - isFavorite false - test", async () => {
      const query: DTemplateDescriptorsPageQuery = {
         filter: {
            isFavorite: false,
         },
      };
      await repository.pGetTemplateDescriptorsPage(userId, query);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
         isFavorite: false,
      };

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - collectionIds - test", async () => {
      const query: DTemplateDescriptorsPageQuery = {
         filter: {
            collectionIds: ["col-1", "col-2"],
         },
      };
      await repository.pGetTemplateDescriptorsPage(userId, query);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
         collectionEntries: {
            some: { collectionId: { in: ["col-1", "col-2"] } },
         },
      };

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - empty arrays - test", async () => {
      const query: DTemplateDescriptorsPageQuery = {
         filter: {
            categories: [],
            models: [],
            collectionIds: [],
         },
      };
      await repository.pGetTemplateDescriptorsPage(userId, query);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
         userId,
      };

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - full filter - test", async () => {
      const filter = dtestData.dTemplateDescriptorsFilter();
      const query: DTemplateDescriptorsPageQuery = {
         filter,
      };
      await repository.pGetTemplateDescriptorsPage(userId, query);

      const expectedWhere: PromptTemplateDescriptorWhereInput = {
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

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
         include: {
            categories: true,
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptTemplateDescriptorFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });
});

describe("pGetPromptTemplateDescriptors tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetPromptTemplateDescriptors - prompts - params undefined - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const result = await repository.pGetPromptTemplateDescriptors();

      const expectedResult = toDTemplateDescriptors(prompts);

      const expectedFindMayArgs: PromptTemplateDescriptorFindManyArgs = {
         include: {
            categories: true,
         },
         take: 20,
      };

      expect(result).toEqual(expectedResult);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("pGetPromptTemplateDescriptors - prompts - params empty - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const result = await repository.pGetPromptTemplateDescriptors({});

      const expectedResult = toDTemplateDescriptors(prompts);

      const expectedFindMayArgs: PromptTemplateDescriptorFindManyArgs = {
         include: {
            categories: true,
         },
         take: 20,
      };

      expect(result).toEqual(expectedResult);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("pGetPromptTemplateDescriptors - prompts - params.search defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const search = "prompt 1";
      const result = await repository.pGetPromptTemplateDescriptors({
         search,
         categories: [],
      });

      const expectedResult = toDTemplateDescriptors(prompts);

      const expectedFindMayArgs: PromptTemplateDescriptorFindManyArgs = {
         where: {
            OR: [
               {
                  title: {
                     contains: search,
                     mode: "insensitive",
                  },
               },
               {
promptContent: {
                     content: {
                        contains: search,
                        mode: "insensitive",
                     },
                  },
               },
            ],
         },
         include: {
            categories: true,
         },
         take: 20,
      };

      expect(result).toEqual(expectedResult);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("pGetPromptTemplateDescriptors - prompts - params.categories defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const categories = ["cat 1", "cat2", "cat 3"];
      const result = await repository.pGetPromptTemplateDescriptors({
         categories,
      });

      const expectedResult = toDTemplateDescriptors(prompts);

      const expectedFindMayArgs: PromptTemplateDescriptorFindManyArgs = {
         where: {
            AND: [
               {
                  categories: {
                     some: {
                        name: {
                           in: categories,
                        },
                     },
                  },
               },
            ],
         },
         include: {
            categories: true,
         },
         take: 20,
      };

      expect(result).toEqual(expectedResult);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("pGetPromptTemplateDescriptors - prompts - params defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const result = await repository.pGetPromptTemplateDescriptors({
         search,
         categories,
      });

      const expectedResult = toDTemplateDescriptors(prompts);

      const expectedFindMayArgs: PromptTemplateDescriptorFindManyArgs = {
         where: {
            OR: [
               {
                  title: {
                     contains: search,
                     mode: "insensitive",
                  },
               },
               {
promptContent: {
                     content: {
                        contains: search,
                        mode: "insensitive",
                     },
                  },
               },
            ],
            AND: [
               {
                  categories: {
                     some: {
                        name: {
                           in: categories,
                        },
                     },
                  },
               },
            ],
         },
         include: {
            categories: true,
         },
         take: 20,
      };

      expect(result).toEqual(expectedResult);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });
});

describe("pGetTemplateDescriptor tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("descriptor null - test", async () => {
      prismaMock.promptTemplateDescriptor.findFirst.mockResolvedValue(null);

      const userId = "user-id-1";
      const id = "prompt-template-descriptor-id-1";
      const result = await repository.pGetTemplateDescriptor(userId, id);

      const expectedWhere: PromptTemplateDescriptorFindFirstArgs = {
         where: { id, userId },
         include: {
            categories: true,
         },
      };
      expect(result).toBeNull();
      expect(
         prismaMock.promptTemplateDescriptor.findFirst
      ).toHaveBeenCalledTimes(1);
      expect(
         prismaMock.promptTemplateDescriptor.findFirst
      ).toHaveBeenCalledWith(expectedWhere);
   });

   test("descriptor retrieved - test", async () => {
      const template = ptestData.pPromptTemplateDescriptorWithTemplate();
      prismaMock.promptTemplateDescriptor.findFirst.mockResolvedValue(template);

      const userId = "user-id-1";
      const id = "prompt-template-descriptor-id-1";
      const result = await repository.pGetTemplateDescriptor(userId, id);

      const expectedResult = toDTemplateDescriptor(template);

      const expectedWhere: PromptTemplateDescriptorFindFirstArgs = {
         where: { id, userId },
         include: {
            categories: true,
         },
      };
      expect(result).toEqual(expectedResult);
      expect(
         prismaMock.promptTemplateDescriptor.findFirst
      ).toHaveBeenCalledTimes(1);
      expect(
         prismaMock.promptTemplateDescriptor.findFirst
      ).toHaveBeenCalledWith(expectedWhere);
   });
});

describe("pGetPromptTemplate tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetPromptTemplate - template null - test", async () => {
      prismaMock.promptContent.findFirst.mockResolvedValue(null);

      const userId = "user-id-1";
      const id = "prompt-template-id-1";
      const result = await repository.pGetPromptTemplate(userId, id);

      const expectedWhere: PromptContentFindFirstArgs = {
         where: {
            id,
            promptTemplateDescriptor: { userId },
         },
         include: {
            fields: true,
            globalFields: true,
         },
      };
      expect(result).toBeNull();
      expect(prismaMock.promptContent.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptContent.findFirst).toHaveBeenCalledWith(
         expectedWhere
      );
   });

   test("pGetPromptTemplate - template retrieved - test", async () => {
      const prompt = ptestData.pPromptTemplate();
      prismaMock.promptContent.findFirst.mockResolvedValue(prompt);

      const userId = "user-id-1";
      const id = "prompt-template-id-1";
      const result = await repository.pGetPromptTemplate(userId, id);
      const expectedResult = toDPromptTemplate(prompt);

      const expectedWhere: PromptContentFindFirstArgs = {
         where: {
            id,
            promptTemplateDescriptor: { userId },
         },
         include: {
            fields: true,
            globalFields: true,
         },
      };
      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptContent.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptContent.findFirst).toHaveBeenCalledWith(
         expectedWhere
      );
   });
});

describe("pGetPromptTemplateCategories queries tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetPromptTemplateCategories - categories retrieved - test", async () => {
      const userId = "user-id-1";
      const categories = ptestData.pPromptTemplateCategories();
      prismaMock.promptTemplateCategory.findMany.mockResolvedValue(categories);

      const result = await repository.pGetPromptTemplateCategories(userId);

      const expectedFindMayArgs: Prisma.PromptTemplateCategoryFindManyArgs = {
         where: { userId },
         select: {
            name: true,
         },
      };

      expect(result).toEqual(categories);
      expect(prismaMock.promptTemplateCategory.findMany).toHaveBeenCalledTimes(
         1
      );
      expect(prismaMock.promptTemplateCategory.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });
});

describe("pCreatePromptTemplateDescriptor tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pCreatePromptTemplateDescriptor - descriptor created - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptTemplateUpdate();
      const newDescriptor = ptestData.pPromptTemplateDescriptorWithCategories();
      prismaMock.promptTemplateDescriptor.create.mockResolvedValue(
         newDescriptor
      );

      const result = await repository.pCreatePromptTemplateDescriptor(
         userId,
         data
      );

      const expectedResult = toDTemplateDescriptor(newDescriptor);

      const expectedInput: PromptTemplateDescriptorCreateInput = {
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
promptContent: {
            create: {
               content: data.content,
               fields: {
                  create: map(
                     data.fields,
                     (field: DPromptTemplateFieldUpdate) => ({
                        name: field.name,
                        label: field.label,
                        description: field.description,
                        type: field.type,
                        required: field.required,
                        order: field.order,
                        defaultValue: field.defaultValue,
                        options: field.options,
                     })
                  ),
               },
               globalFields: {
                  create: map(data.globalFieldIds, (id, idx) => ({
                     globalFieldId: id,
                     order: idx,
                  })),
               },
            },
         },
         user: {
            connect: {
               id: userId,
            },
         },
      };

      const expectedCreateArgs: PromptTemplateDescriptorCreateArgs = {
         data: expectedInput,
         include: {
            categories: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptTemplateDescriptor.create).toHaveBeenCalledTimes(
         1
      );
      expect(prismaMock.promptTemplateDescriptor.create).toHaveBeenCalledWith(
         expectedCreateArgs
      );
   });
});

describe("pUpdatePromptTemplateDescriptor tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pUpdatePromptTemplateDescriptor - descriptor updated - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptTemplateUpdate();
      const descriptor = ptestData.pPromptTemplateDescriptorWithCategories();

      await repository.pUpdatePromptTemplateDescriptor(
         userId,
         descriptor.id,
         data
      );

      const expectedInput: PromptTemplateDescriptorUpdateInput = {
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
promptContent: {
            update: {
               content: data.content,
               fields: {
                  deleteMany: {},
                  create: map(
                     data.fields,
                     (field: DPromptTemplateFieldUpdate) => ({
                        name: field.name,
                        label: field.label,
                        description: field.description,
                        type: field.type as DPromptTemplateFieldType,
                        required: field.required,
                        order: field.order,
                        defaultValue: field.defaultValue,
                        options: field.options,
                     })
                  ),
               },
               globalFields: {
                  deleteMany: {},
                  create: map(data.globalFieldIds, (id, idx) => ({
                     globalFieldId: id,
                     order: idx,
                  })),
               },
            },
         },
      };

      const expectedUpdateArgs: PromptTemplateDescriptorUpdateArgs = {
         where: { id: descriptor.id },
         data: expectedInput,
      };

      expect(prismaMock.promptTemplateDescriptor.update).toHaveBeenCalledTimes(
         1
      );
      expect(prismaMock.promptTemplateDescriptor.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });
});

describe("pDeletePromptTemplateDescriptor tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pDeletePromptTemplateDescriptor - descriptor deleted - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "descriptor-id-1";

      await repository.pDeletePromptTemplateDescriptor(userId, descriptorId);

      const expectedArgs: PromptTemplateDescriptorDeleteArgs = {
         where: { id: descriptorId, userId },
      };

      expect(prismaMock.promptTemplateDescriptor.delete).toHaveBeenCalledTimes(
         1
      );
      expect(prismaMock.promptTemplateDescriptor.delete).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pToggleFavorite tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pToggleFavorite - isFavorite true - test", async () => {
      const descriptorId = "descriptor-id-1";
      const userId = "user-id-1";

      await repository.pToggleFavorite(userId, descriptorId, true);

      const expectedUpdateArgs: PromptTemplateDescriptorUpdateArgs = {
         where: { id: descriptorId, userId },
         data: { isFavorite: true },
      };

      expect(prismaMock.promptTemplateDescriptor.update).toHaveBeenCalledTimes(
         1
      );
      expect(prismaMock.promptTemplateDescriptor.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });

   test("pToggleFavorite - isFavorite false - test", async () => {
      const descriptorId = "descriptor-id-1";
      const userId = "user-id-1";

      await repository.pToggleFavorite(userId, descriptorId, false);

      const expectedUpdateArgs: PromptTemplateDescriptorUpdateArgs = {
         where: { id: descriptorId, userId },
         data: { isFavorite: false },
      };

      expect(prismaMock.promptTemplateDescriptor.update).toHaveBeenCalledTimes(
         1
      );
      expect(prismaMock.promptTemplateDescriptor.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });
});

describe("pGetTemplateCategories tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetTemplateCategories - categories retrieved - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(
         descriptors
      );

      const result = await repository.pGetTemplateCategories(userId);

      const expecteCategories = flatMap(descriptors, (d) =>
         map(d.categories, (cat) => cat.name)
      );
      const expectedResult = uniq(expecteCategories).sort();

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: { userId },
         include: {
            categories: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});

describe("pGetTemplateModels tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetTemplateModels - models retrieved - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(
         descriptors
      );

      const result = await repository.pGetTemplateModels(userId);

      const expecteModels = map(descriptors, (d) => d.recommendedModel);
      const expectedResult = uniq(expecteModels).sort();

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
         where: { userId },
         select: {
            recommendedModel: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});
