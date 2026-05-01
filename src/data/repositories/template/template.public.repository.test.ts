import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";
import {
   PromptTemplateDescriptorCountArgs,
   PromptTemplateDescriptorFindManyArgs,
   PromptTemplateFindFirstArgs,
} from "@/generated/prisma/models";

import { toDPromptTemplate, toDTemplateDescriptors } from "./template.mapper";
import { PublicTemplateRepository } from "./template.public.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const repository = new PublicTemplateRepository(prismaMock);

describe("pGetTemplateDescriptorsPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetTemplateDescriptorsPage - pagination undefined - test", async () => {
      const descriptors = ptestData.pPromptTemplateDescriptorsWithCategories();
      const totalEntries = 25;
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(
         descriptors
      );
      prismaMock.promptTemplateDescriptor.count.mockResolvedValue(totalEntries);

      const query: DTemplateDescriptorsPageQuery = {
         filter: { collectionIds: ["col-1"] },
         sort: { field: "createdAt", order: "asc" },
      };

      const result = await repository.pGetPublicTemplateDescriptorsPage(query);

      const expectedResult: DTemplateDescriptorsPage = {
         content: toDTemplateDescriptors(descriptors),
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: descriptors.length,
         totalPages: Math.ceil(totalEntries / 20),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
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

      const expectedCountArgs: PromptTemplateDescriptorCountArgs = {
         where: {
            collectionEntries: {
               some: { collectionId: { in: ["col-1"] } },
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("pGetTemplateDescriptorsPage - pagination defined - test", async () => {
      const descriptors = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(
         descriptors
      );
      prismaMock.promptTemplateDescriptor.count.mockResolvedValue(0);

      const query: DTemplateDescriptorsPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         filter: { collectionIds: ["col-2"] },
         sort: { field: "title", order: "asc" },
      };

      await repository.pGetPublicTemplateDescriptorsPage(query);

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
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

      const expectedCountArgs: PromptTemplateDescriptorFindManyArgs = {
         where: {
            collectionEntries: {
               some: { collectionId: { in: ["col-2"] } },
            },
         },
      };

      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("pGetTemplateDescriptorsPage - next page query - test", async () => {
      const descriptors = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(
         descriptors
      );
      prismaMock.promptTemplateDescriptor.count.mockResolvedValue(0);

      const query: DTemplateDescriptorsPageQuery = {
         pagination: { pageNumber: 2, pageSize: 10 },
         filter: { collectionIds: ["col-1", "col-2", "col-3"] },
         sort: { field: "title", order: "desc" },
      };

      await repository.pGetPublicTemplateDescriptorsPage(query);

      const expectedFindManyArgs: PromptTemplateDescriptorFindManyArgs = {
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

      const expectedCountArgs: PromptTemplateDescriptorFindManyArgs = {
         where: {
            collectionEntries: {
               some: { collectionId: { in: ["col-1", "col-2", "col-3"] } },
            },
         },
      };

      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.promptTemplateDescriptor.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });
});

describe("pGetPublicPromptTemplate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("template null - test", async () => {
      prismaMock.promptTemplate.findFirst.mockResolvedValue(null);

      const id = "prompt-template-id-1";
      const result = await repository.pGetPublicPromptTemplate(id);

      const expectedWhere: PromptTemplateFindFirstArgs = {
         where: {
            id,
         },
         include: {
            fields: true,
            globalFields: true,
         },
      };
      expect(result).toBeNull();
      expect(prismaMock.promptTemplate.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplate.findFirst).toHaveBeenCalledWith(
         expectedWhere
      );
   });

   test("template retrieved - test", async () => {
      const prompt = ptestData.pPromptTemplate();
      prismaMock.promptTemplate.findFirst.mockResolvedValue(prompt);

      const id = "prompt-template-id-1";
      const result = await repository.pGetPublicPromptTemplate(id);
      const expectedResult = toDPromptTemplate(prompt);

      const expectedWhere: PromptTemplateFindFirstArgs = {
         where: {
            id,
         },
         include: {
            fields: true,
            globalFields: true,
         },
      };
      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptTemplate.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplate.findFirst).toHaveBeenCalledWith(
         expectedWhere
      );
   });
});
