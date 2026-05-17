import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { flatMap, map, uniq } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   DPromptFieldType,
   DPromptFieldUpdate,
   DPromptsPage,
   DPromptsPageQuery,
} from "@/data/types/domain/prompt";
import { Prisma } from "@/generated/prisma/client";
import {
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

import { toDPrompt, toDPrompts, toDPromptWithContent } from "./prompt.mapper";
import { TemplateRepository } from "./prompt.user.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const repository = new TemplateRepository(prismaMock);

describe("pGetTemplateDescriptorsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetTemplateDescriptorsPage - no query - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptsWithCategories();
      const totalEntries = 15;
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);
      prismaMock.prompt.count.mockResolvedValue(totalEntries);

      const result = await repository.pGetTemplateDescriptorsPage(userId);

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

   test("pGetTemplateDescriptorsPage - sort createdAt asc - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptsWithCategories();
      const totalEntries = 25;
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);
      prismaMock.prompt.count.mockResolvedValue(totalEntries);

      const query: DPromptsPageQuery = {
         pagination: { pageNumber: 2, pageSize: 10 },
         sort: { field: "createdAt", order: "asc" },
      };

      const result = await repository.pGetTemplateDescriptorsPage(
         userId,
         query
      );

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
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("pGetTemplateDescriptorsPage - sort title asc - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);
      prismaMock.prompt.count.mockResolvedValue(0);

      const query: DPromptsPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         sort: { field: "title", order: "asc" },
      };

      await repository.pGetTemplateDescriptorsPage(userId, query);

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

      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("pGetTemplateDescriptorsPage - sort title desc - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);
      prismaMock.prompt.count.mockResolvedValue(0);

      const query: DPromptsPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         sort: { field: "title", order: "desc" },
      };

      await repository.pGetTemplateDescriptorsPage(userId, query);

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: { userId },
         include: {
            categories: true,
         },
         orderBy: { title: "desc" },
         skip: 0,
         take: 10,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: { userId },
      };

      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });
});

describe("pGetTemplateDescriptorsPage - resolveWhereInput tests", () => {
   const userId = "user-id-1";

   beforeEach(() => {
      jest.clearAllMocks();

      const descriptors = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);
      prismaMock.prompt.count.mockResolvedValue(0);
   });

   test("resolveWhereInput - no filter - test", async () => {
      await repository.pGetTemplateDescriptorsPage(userId);

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
      await repository.pGetTemplateDescriptorsPage(userId, query);

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
      await repository.pGetTemplateDescriptorsPage(userId, query);

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
      await repository.pGetTemplateDescriptorsPage(userId, query);

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
      await repository.pGetTemplateDescriptorsPage(userId, query);

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
      await repository.pGetTemplateDescriptorsPage(userId, query);

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
      await repository.pGetTemplateDescriptorsPage(userId, query);

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
      await repository.pGetTemplateDescriptorsPage(userId, query);

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
      await repository.pGetTemplateDescriptorsPage(userId, query);

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

describe("pGetPrompts tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetPrompts - prompts - params undefined - retrieved - test", async () => {
      const prompts = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(prompts);

      const result = await repository.pGetPrompts();

      const expectedResult = toDPrompts(prompts);

      const expectedFindMayArgs: PromptFindManyArgs = {
         include: {
            categories: true,
         },
         take: 20,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("pGetPrompts - prompts - params empty - retrieved - test", async () => {
      const prompts = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(prompts);

      const result = await repository.pGetPrompts({});

      const expectedResult = toDPrompts(prompts);

      const expectedFindMayArgs: PromptFindManyArgs = {
         include: {
            categories: true,
         },
         take: 20,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("pGetPrompts - prompts - params.search defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(prompts);

      const search = "prompt 1";
      const result = await repository.pGetPrompts({
         search,
         categories: [],
      });

      const expectedResult = toDPrompts(prompts);

      const expectedFindMayArgs: PromptFindManyArgs = {
         where: {
            OR: [
               {
                  title: {
                     contains: search,
                     mode: "insensitive",
                  },
               },
               {
                  content: {
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
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("pGetPrompts - prompts - params.categories defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(prompts);

      const categories = ["cat 1", "cat2", "cat 3"];
      const result = await repository.pGetPrompts({
         categories,
      });

      const expectedResult = toDPrompts(prompts);

      const expectedFindMayArgs: PromptFindManyArgs = {
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
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("pGetPrompts - prompts - params defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(prompts);

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const result = await repository.pGetPrompts({
         search,
         categories,
      });

      const expectedResult = toDPrompts(prompts);

      const expectedFindMayArgs: PromptFindManyArgs = {
         where: {
            OR: [
               {
                  title: {
                     contains: search,
                     mode: "insensitive",
                  },
               },
               {
                  content: {
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
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });
});

describe("pGetTemplateDescriptor tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("descriptor null - test", async () => {
      prismaMock.prompt.findFirst.mockResolvedValue(null);

      const userId = "user-id-1";
      const id = "prompt-template-descriptor-id-1";
      const result = await repository.pGetTemplateDescriptor(userId, id);

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

   test("descriptor retrieved - test", async () => {
      const template = ptestData.pPromptWithTemplate();
      prismaMock.prompt.findFirst.mockResolvedValue(template);

      const userId = "user-id-1";
      const id = "prompt-template-descriptor-id-1";
      const result = await repository.pGetTemplateDescriptor(userId, id);

      const expectedResult = toDPrompt(template);

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

describe("pGetPromptTemplate tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetPromptTemplate - template null - test", async () => {
      prismaMock.prompt.findFirst.mockResolvedValue(null);

      const userId = "user-id-1";
      const id = "prompt-template-id-1";
      const result = await repository.pGetPromptTemplate(userId, id);

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

   test("pGetPromptTemplate - template retrieved - test", async () => {
      const prompt = ptestData.pPromptWithContent();
      prismaMock.prompt.findFirst.mockResolvedValue(prompt);

      const userId = "user-id-1";
      const id = "prompt-template-id-1";
      const result = await repository.pGetPromptTemplate(userId, id);
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

describe("pGetPromptTemplateCategories queries tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetPromptTemplateCategories - categories retrieved - test", async () => {
      const userId = "user-id-1";
      const categories = ptestData.pPromptCategories();
      prismaMock.promptCategory.findMany.mockResolvedValue(categories);

      const result = await repository.pGetPromptTemplateCategories(userId);

      const expectedFindMayArgs: Prisma.PromptCategoryFindManyArgs = {
         where: { userId },
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

   test("pCreatePrompt - descriptor created - test", async () => {
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
            create: map(data.fields, (field: DPromptFieldUpdate) => ({
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

   test("pUpdatePrompt - descriptor updated - test", async () => {
      const userId = "user-id-123";
      const data = dtestData.dPromptUpdate();
      const descriptor = ptestData.pPromptWithCategories();

      await repository.pUpdatePrompt(userId, descriptor.id, data);

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
            create: map(data.fields, (field: DPromptFieldUpdate) => ({
               name: field.name,
               label: field.label,
               description: field.description,
               type: field.type as DPromptFieldType,
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
         where: { id: descriptor.id },
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

   test("pDeletePrompt - descriptor deleted - test", async () => {
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

describe("pToggleFavorite tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pToggleFavorite - isFavorite true - test", async () => {
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

   test("pToggleFavorite - isFavorite false - test", async () => {
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

   test("pGetTemplateCategories - categories retrieved - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);

      const result = await repository.pGetTemplateCategories(userId);

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

   test("pGetTemplateModels - models retrieved - test", async () => {
      const userId = "user-id-1";
      const descriptors = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);

      const result = await repository.pGetTemplateModels(userId);

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
