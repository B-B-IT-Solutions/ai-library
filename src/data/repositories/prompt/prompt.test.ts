import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   PromptDescriptorsPage,
   PromptDescriptorsPageQuery,
} from "@/data/types/db/prompt";
import { Prisma } from "@/generated/prisma/client";
import {
   PromptCategoryFindManyArgs,
   PromptCreateArgs,
   PromptDescriptorCountArgs,
   PromptDescriptorFindFirstArgs,
   PromptDescriptorFindManyArgs,
   PromptDescriptorWhereInput,
} from "@/generated/prisma/models";

import { GetPromptQuery, PromptRepository } from "./prompt";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const promptRepository = new PromptRepository(prismaMock);

describe("pGetPromptDescriptors tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetPromptDescriptors - query undefined - test", async () => {
      const prompts = ptestData.pPromptDescriptorssWithCategories();
      prismaMock.promptDescriptor.findMany.mockResolvedValue(prompts);
      prismaMock.promptDescriptor.count.mockResolvedValue(prompts.length);

      const result = await promptRepository.pGetPromptDescriptors();

      const expectedResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 0,
         pageSize: 10,
         totalElements: 3,
         totalPages: 1,
      };
      const expectedWhereClause = undefined;
      const expectedFindManyArgs: PromptDescriptorFindManyArgs = {
         where: expectedWhereClause,
         skip: 0,
         take: 10,
         include: {
            categories: true,
         },
      };
      const expedtedCountArgs: PromptDescriptorCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
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
      const prompts = ptestData.pPromptDescriptorssWithCategories();
      prismaMock.promptDescriptor.findMany.mockResolvedValue(prompts);
      prismaMock.promptDescriptor.count.mockResolvedValue(prompts.length);

      const query: PromptDescriptorsPageQuery = {};
      const result = await promptRepository.pGetPromptDescriptors(query);

      const expectedResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 0,
         pageSize: 10,
         totalElements: 3,
         totalPages: 1,
      };
      const expectedWhereClause = undefined;
      const expectedFindManyArgs: PromptDescriptorFindManyArgs = {
         where: expectedWhereClause,
         skip: 0,
         take: 10,
         include: {
            categories: true,
         },
      };
      const expedtedCountArgs: PromptDescriptorCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
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
      const prompts = ptestData.pPromptDescriptorssWithCategories(21);
      prismaMock.promptDescriptor.findMany.mockResolvedValue(prompts);
      prismaMock.promptDescriptor.count.mockResolvedValue(prompts.length);

      const query: PromptDescriptorsPageQuery = {
         pagination: { pageNumber: 3, pageSize: 5 },
         globalFilter: "test 123",
      };
      const result = await promptRepository.pGetPromptDescriptors(query);

      const expectedResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
      const expectedWhereClause: PromptDescriptorWhereInput = {
         OR: [
            {
               title: {
                  contains: query.globalFilter,
                  mode: "insensitive",
               },
            },
            {
               prompt: {
                  content: {
                     contains: query.globalFilter,
                     mode: "insensitive",
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
      };
      const expedtedCountArgs: PromptDescriptorCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
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
      const prompts = ptestData.pPromptDescriptorssWithCategories(21);
      prismaMock.promptDescriptor.findMany.mockResolvedValue(prompts);
      prismaMock.promptDescriptor.count.mockResolvedValue(prompts.length);

      const query: PromptDescriptorsPageQuery = {
         pagination: { pageNumber: 3, pageSize: 5 },
         filter: {
            categories: ["cat 123"],
         },
      };
      const result = await promptRepository.pGetPromptDescriptors(query);

      const expectedResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
      const expectedWhereClause: PromptDescriptorWhereInput = {
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
      };
      const expedtedCountArgs: PromptDescriptorCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
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
      const prompts = ptestData.pPromptDescriptorssWithCategories(21);
      prismaMock.promptDescriptor.findMany.mockResolvedValue(prompts);
      prismaMock.promptDescriptor.count.mockResolvedValue(prompts.length);

      const query: PromptDescriptorsPageQuery = {
         pagination: { pageNumber: 3, pageSize: 5 },
         globalFilter: "test 1",
         filter: {
            categories: ["cat 1"],
         },
      };
      const result = await promptRepository.pGetPromptDescriptors(query);

      const expectedResult: PromptDescriptorsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
      const expectedWhereClause: PromptDescriptorWhereInput = {
         OR: [
            {
               title: {
                  contains: query.globalFilter,
                  mode: "insensitive",
               },
            },
            {
               prompt: {
                  content: {
                     contains: query.globalFilter,
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
      };
      const expedtedCountArgs: PromptDescriptorCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
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
      const prompt = ptestData.pPromptDescriptorWithCategories();
      prismaMock.promptDescriptor.findFirst.mockResolvedValue(prompt);

      const query: GetPromptQuery = { id: "1" };
      const result = await promptRepository.pGetPromptDescriptor(query);

      const expectedWhere: PromptDescriptorFindFirstArgs = {
         where: {
            id: query.id,
         },
         include: {
            categories: true,
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

describe("createPrompt tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("createPrompt - prompt created - test", async () => {
      const input = ptestData.pPromptCreateInput();
      prismaMock.prompt.create.mockResolvedValue(input);
      const result = await promptRepository.pCreatePrompt(input);

      const expectedCreateArgs: PromptCreateArgs = {
         data: {
            content: input.content,
            descriptor: input.descriptor,
         },
      };

      expect(result).toEqual(input);
      expect(prismaMock.prompt.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.create).toHaveBeenCalledWith(expectedCreateArgs);
   });
});

describe("updatePrompt tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("updatePrompt - prompt updated - test", async () => {
      const promptId = "prompt-id-1";
      const input = ptestData.pPromptUpdateInput();
      prismaMock.prompt.update.mockResolvedValue(input);
      const result = await promptRepository.pUpdatePrompt(promptId, input);

      const expectedUpdateArgs: Prisma.PromptUpdateArgs = {
         where: { id: promptId },
         data: input,
      };

      expect(result).toEqual(input);
      expect(prismaMock.prompt.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.update).toHaveBeenCalledWith(expectedUpdateArgs);
   });
});
