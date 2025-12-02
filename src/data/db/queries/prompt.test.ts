import { PrismaClient } from "@prisma/client";
import { PrismaPromise } from "@prisma/client/runtime/library";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import { PromptsPage, PromptsPageQuery } from "@/data/types/db/prompt";
import { DPromptsPage } from "@/data/types/domain/prompt";
import { Prisma } from "@/generated/prisma/client";
import {
   PromptAggregateArgs,
   PromptCategoryFindManyArgs,
   PromptCountArgs,
   PromptFindFirstArgs,
   PromptFindManyArgs,
   PromptWhereInput,
} from "@/generated/prisma/models";
import prisma from "../prisma";

import {
   createPrompt,
   getPrompt,
   getPromptCategories,
   GetPromptQuery,
   getPrompts,
   updatePrompt,
} from "./prompt";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const mockPrismaTransations = () => {
   (prismaMock.$transaction as jest.Mock).mockImplementation(
      (transactionSteps: PrismaPromise<DPromptsPage>[]) => {
         return Promise.all(transactionSteps);
      }
   );
};

describe("getPrompts tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
      mockPrismaTransations();
   });

   test("getPrompts - query undefined - test", async () => {
      const prompts = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(prompts);
      prismaMock.prompt.count.mockResolvedValue(prompts.length);

      const result = await getPrompts();

      const expectedResult: PromptsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 0,
         pageSize: 10,
         totalElements: 3,
         totalPages: 1,
      };
      const expectedWhereClause = undefined;
      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhereClause,
         skip: 0,
         take: 10,
         include: {
            categories: true,
         },
      };
      const expedtedCountArgs: PromptCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expedtedCountArgs);
   });

   test("getPrompts - query empty - test", async () => {
      const prompts = ptestData.pPromptsWithCategories();
      prismaMock.prompt.findMany.mockResolvedValue(prompts);
      prismaMock.prompt.count.mockResolvedValue(prompts.length);

      const query: PromptsPageQuery = {};
      const result = await getPrompts(query);

      const expectedResult: PromptsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 0,
         pageSize: 10,
         totalElements: 3,
         totalPages: 1,
      };
      const expectedWhereClause = undefined;
      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhereClause,
         skip: 0,
         take: 10,
         include: {
            categories: true,
         },
      };
      const expedtedCountArgs: PromptCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expedtedCountArgs);
   });

   test("getPrompts - query.globalFilter defined - test", async () => {
      const prompts = ptestData.pPromptsWithCategories(21);
      prismaMock.prompt.findMany.mockResolvedValue(prompts);
      prismaMock.prompt.count.mockResolvedValue(prompts.length);

      const query: PromptsPageQuery = {
         pagination: { pageNumber: 3, pageSize: 5 },
         globalFilter: "test 123",
      };
      const result = await getPrompts(query);

      const expectedResult: PromptsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
      const expectedWhereClause: PromptWhereInput = {
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
      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhereClause,
         skip: 15,
         take: 5,
         include: {
            categories: true,
         },
      };
      const expedtedCountArgs: PromptCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expedtedCountArgs);
   });

   test("getPrompts - query.filter defined - test", async () => {
      const prompts = ptestData.pPromptsWithCategories(21);
      prismaMock.prompt.findMany.mockResolvedValue(prompts);
      prismaMock.prompt.count.mockResolvedValue(prompts.length);

      const query: PromptsPageQuery = {
         pagination: { pageNumber: 3, pageSize: 5 },
         filter: {
            categories: ["cat 123"],
         },
      };
      const result = await getPrompts(query);

      const expectedResult: PromptsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
      const expectedWhereClause: PromptWhereInput = {
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
      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhereClause,
         skip: 15,
         take: 5,
         include: {
            categories: true,
         },
      };
      const expedtedCountArgs: PromptCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expedtedCountArgs);
   });

   test("getPrompts - query defined - test", async () => {
      const prompts = ptestData.pPromptsWithCategories(21);
      prismaMock.prompt.findMany.mockResolvedValue(prompts);
      prismaMock.prompt.count.mockResolvedValue(prompts.length);

      const query: PromptsPageQuery = {
         pagination: { pageNumber: 3, pageSize: 5 },
         globalFilter: "test 1",
         filter: {
            categories: ["cat 1"],
         },
      };
      const result = await getPrompts(query);

      const expectedResult: PromptsPage = {
         content: prompts,
         numberOfElements: prompts.length,
         pageNumber: 3,
         pageSize: 5,
         totalElements: 21,
         totalPages: 5,
      };
      const expectedWhereClause: PromptWhereInput = {
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
      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhereClause,
         skip: 15,
         take: 5,
         include: {
            categories: true,
         },
      };
      const expedtedCountArgs: PromptCountArgs = {
         where: expectedWhereClause,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.prompt.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.count).toHaveBeenCalledWith(expedtedCountArgs);
   });
});

describe("getPrompt tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("getPrompt - id defiend - slug undefined - test", async () => {
      const prompt = ptestData.pPromptWithCategories();
      prismaMock.prompt.findFirst.mockResolvedValue(prompt);

      const query: GetPromptQuery = { id: "1" };
      const result = await getPrompt(query);

      const expectedWhere: PromptFindFirstArgs = {
         where: {
            id: query.id,
         },
         include: {
            categories: true,
         },
      };
      expect(result).toEqual(prompt);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledWith(expectedWhere);
   });

   test("getPrompt - id undefiend - slug defined - test", async () => {
      prismaMock.prompt.findFirst.mockResolvedValue(null);

      const query: GetPromptQuery = { id: "1" };
      const result = await getPrompt(query);

      const expectedWhere: PromptFindFirstArgs = {
         where: {
            id: query.id,
         },
         include: {
            categories: true,
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findFirst).toHaveBeenCalledWith(expectedWhere);
   });
});

describe("getPromptCategories queries tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("getPromptCategories - categories retrieved - test", async () => {
      const categories = ptestData.pPromptCategories();
      prismaMock.promptCategory.findMany.mockResolvedValue(categories);

      const result = await getPromptCategories();

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
      const prompt = ptestData.pPromptCreateInput();
      prismaMock.prompt.create.mockResolvedValue(prompt);
      const result = await createPrompt(prompt);

      const expectedCreateArgs: Prisma.PromptCreateArgs = {
         data: prompt,
      };

      expect(result).toEqual(prompt);
      expect(prismaMock.prompt.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.create).toHaveBeenCalledWith(expectedCreateArgs);
   });
});

describe("updateCart tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("updateCart - prompt updated - test", async () => {
      const promptId = "prompt-id-1";
      const prompt = ptestData.pPromptUpdateInput();
      prismaMock.prompt.update.mockResolvedValue(prompt);
      const result = await updatePrompt(promptId, prompt);

      const expectedUpdateArgs: Prisma.PromptUpdateArgs = {
         where: { id: promptId },
         data: prompt,
      };

      expect(result).toEqual(prompt);
      expect(prismaMock.prompt.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.update).toHaveBeenCalledWith(expectedUpdateArgs);
   });
});
