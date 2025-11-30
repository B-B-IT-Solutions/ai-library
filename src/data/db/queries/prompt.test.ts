import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import { PromptsPageQuery } from "@/data/types/db/prompt";
import { Prisma } from "@/generated/prisma/client";
import prisma from "../prisma";

import { createPrompt, getPrompts, updatePrompt } from "./prompt";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("getPrompts tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("getPrompts - query undefined - test", async () => {
      const prompts = ptestData.pPrompts();
      prismaMock.prompt.findMany.mockResolvedValue(prompts);

      const result = await getPrompts();

      const expectedFindManyArgs: Prisma.PromptFindManyArgs = {
         skip: 0,
         take: 10,
      };

      expect(result).toEqual(prompts);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });

   test("getPrompts - query empty - test", async () => {
      const prompts = ptestData.pPrompts();
      prismaMock.prompt.findMany.mockResolvedValue(prompts);

      const query: PromptsPageQuery = {};
      const result = await getPrompts(query);

      const expectedFindManyArgs: Prisma.PromptFindManyArgs = {
         skip: 0,
         take: 10,
      };

      expect(result).toEqual(prompts);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });

   test("getPrompts - query defined - test", async () => {
      const prompts = ptestData.pPrompts();
      prismaMock.prompt.findMany.mockResolvedValue(prompts);

      const query: PromptsPageQuery = {
         pagination: { pageNumber: 5, pageSize: 15 },
      };
      const result = await getPrompts(query);

      const expectedFindManyArgs: Prisma.PromptFindManyArgs = {
         skip: 60,
         take: 15,
      };

      expect(result).toEqual(prompts);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.prompt.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
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
