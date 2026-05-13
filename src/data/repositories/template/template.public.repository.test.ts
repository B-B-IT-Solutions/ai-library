import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DPromptsPage, DPromptsPageQuery } from "@/data/types/domain/prompt";
import {
   PromptCountArgs,
   PromptFindFirstArgs,
   PromptFindManyArgs,
} from "@/generated/prisma/models";

import {
   toDPromptTemplate,
   toDTemplateDescriptor,
   toDTemplateDescriptors,
} from "./template.mapper";
import { PublicTemplateRepository } from "./template.public.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const repository = new PublicTemplateRepository(prismaMock);

describe("pGetTemplateDescriptorsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetTemplateDescriptorsPage - pagination undefined - test", async () => {
      const descriptors = ptestData.pPromptsWithCategories();
      const totalEntries = 25;
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);
      prismaMock.prompt.count.mockResolvedValue(totalEntries);

      const query: DPromptsPageQuery = {
         filter: { collectionIds: ["col-1"] },
         sort: { field: "createdAt", order: "asc" },
      };

      const result = await repository.pGetPublicTemplateDescriptorsPage(query);

      const expectedResult: DPromptsPage = {
         content: toDTemplateDescriptors(descriptors),
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: descriptors.length,
         totalPages: Math.ceil(totalEntries / 20),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: {
            collectionEntries: {
               some: { collectionId: { in: ["col-1"] } },
            },
         },
         include: {
            categories: true,
         },
         orderBy: { createdAt: "asc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: PromptCountArgs = {
         where: {
            collectionEntries: {
               some: { collectionId: { in: ["col-1"] } },
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("pGetTemplateDescriptorsPage - pagination defined - test", async () => {
      const descriptors = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);
      prismaMock.prompt.count.mockResolvedValue(0);

      const query: DPromptsPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         filter: { collectionIds: ["col-2"] },
         sort: { field: "title", order: "asc" },
      };

      await repository.pGetPublicTemplateDescriptorsPage(query);

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: {
            collectionEntries: {
               some: { collectionId: { in: ["col-2"] } },
            },
         },
         include: {
            categories: true,
         },
         orderBy: { title: "asc" },
         skip: 0,
         take: 10,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: {
            collectionEntries: {
               some: { collectionId: { in: ["col-2"] } },
            },
         },
      };

      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });

   test("pGetTemplateDescriptorsPage - next page query - test", async () => {
      const descriptors = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(descriptors);
      prismaMock.prompt.count.mockResolvedValue(0);

      const query: DPromptsPageQuery = {
         pagination: { pageNumber: 2, pageSize: 10 },
         filter: { collectionIds: ["col-1", "col-2", "col-3"] },
         sort: { field: "title", order: "desc" },
      };

      await repository.pGetPublicTemplateDescriptorsPage(query);

      const expectedFindManyArgs: PromptFindManyArgs = {
         where: {
            collectionEntries: {
               some: { collectionId: { in: ["col-1", "col-2", "col-3"] } },
            },
         },
         include: {
            categories: true,
         },
         orderBy: { title: "desc" },
         skip: 20,
         take: 10,
      };

      const expectedCountArgs: PromptFindManyArgs = {
         where: {
            collectionEntries: {
               some: { collectionId: { in: ["col-1", "col-2", "col-3"] } },
            },
         },
      };

      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expectedCountArgs);
   });
});

describe("pGetPublicTemplateDescriptor tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("descriptor null - test", async () => {
      prismaMock.prompt.findFirst.mockResolvedValue(null);

      const id = "descriptor-1";
      const result = await repository.pGetPublicTemplateDescriptor(id);

      const expectedArgs: PromptFindFirstArgs = {
         where: { id },
         include: {
            categories: true,
         },
      };
      expect(result).toBeNull();
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledWith(expectedArgs);
   });

   test("descriptor retrieved - test", async () => {
      const descriptor = ptestData.pPromptWithCategories();
      prismaMock.prompt.findFirst.mockResolvedValue(descriptor);

      const id = "descriptor-1";
      const result = await repository.pGetPublicTemplateDescriptor(id);
      const expectedResult = toDTemplateDescriptor(descriptor);

      const expectedArgs: PromptFindFirstArgs = {
         where: { id },
         include: {
            categories: true,
         },
      };
      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pGetPublicPromptTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("template null - test", async () => {
      prismaMock.prompt.findFirst.mockResolvedValue(null);

      const id = "prompt-template-id-1";
      const result = await repository.pGetPublicPromptTemplate(id);

      const expectedArgs: PromptFindFirstArgs = {
         where: { id },
         include: {
            content: true,
            categories: true,
            fields: true,
            globalFields: true,
         },
      };
      expect(result).toBeNull();
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledWith(expectedArgs);
   });

   test("template retrieved - test", async () => {
      const prompt = ptestData.pPromptWithContent();
      prismaMock.prompt.findFirst.mockResolvedValue(prompt);

      const id = "prompt-template-id-1";
      const result = await repository.pGetPublicPromptTemplate(id);
      const expectedResult = toDPromptTemplate(prompt);

      const expectedArgs: PromptFindFirstArgs = {
         where: { id },
         include: {
            content: true,
            categories: true,
            fields: true,
            globalFields: true,
         },
      };
      expect(result).toEqual(expectedResult);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledWith(expectedArgs);
   });
});
