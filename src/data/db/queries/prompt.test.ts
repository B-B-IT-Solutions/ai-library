import { PrismaClient } from "@prisma/client";
import { PrismaPromise } from "@prisma/client/runtime/library";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import { PromptsPage, PromptsPageQuery } from "@/data/types/db/prompt";
import { DPromptsPage } from "@/data/types/domain/prompt";
import { Prisma } from "@/generated/prisma/client";
import {
   PromptCountArgs,
   PromptFindManyArgs,
   PromptWhereInput,
} from "@/generated/prisma/models";
import prisma from "../prisma";

import { createPrompt, getPrompts, updatePrompt } from "./prompt";

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
      const prompts = ptestData.pPrompts();
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
      const expectedWhereClause: PromptWhereInput = {};
      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhereClause,
         skip: 0,
         take: 10,
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
      const prompts = ptestData.pPrompts();
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
      const expectedWhereClause: PromptWhereInput = {};
      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhereClause,
         skip: 0,
         take: 10,
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
      const prompts = ptestData.pPrompts(21);
      prismaMock.prompt.findMany.mockResolvedValue(prompts);
      prismaMock.prompt.count.mockResolvedValue(prompts.length);

      const query: PromptsPageQuery = {
         pagination: { pageNumber: 3, pageSize: 5 },
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
      const expectedWhereClause: PromptWhereInput = {};
      const expectedFindManyArgs: PromptFindManyArgs = {
         where: expectedWhereClause,
         skip: 15,
         take: 5,
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
