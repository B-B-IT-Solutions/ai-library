import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import { Prisma } from "@/generated/prisma/client";
import prisma from "../prisma";

import {
   getPromptTemplateCategories,
   getPromptTemplates,
} from "./prompt.template";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("getPromptTemplates tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("getPromptTemplates - prompts - params undefined - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplates();
      prismaMock.promptTemplate.findMany.mockResolvedValue(prompts);

      const result = await getPromptTemplates();

      const expectedFindMayArgs: Prisma.PromptTemplateFindManyArgs = {
         include: {
            categories: true,
         },
      };

      expect(result).toEqual(prompts);
      expect(prismaMock.promptTemplate.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplate.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("getPromptTemplates - prompts - params {} - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplates();
      prismaMock.promptTemplate.findMany.mockResolvedValue(prompts);

      const result = await getPromptTemplates({});

      const expectedFindMayArgs: Prisma.PromptTemplateFindManyArgs = {
         include: {
            categories: true,
         },
      };

      expect(result).toEqual(prompts);
      expect(prismaMock.promptTemplate.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplate.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("getPromptTemplates - prompts - params.search defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplates();
      prismaMock.promptTemplate.findMany.mockResolvedValue(prompts);

      const search = "prompt 1";
      const result = await getPromptTemplates({ search });

      const expectedFindMayArgs: Prisma.PromptTemplateFindManyArgs = {
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
                     contains: search,
                     mode: "insensitive",
                  },
               },
            ],
         },
         include: {
            categories: true,
         },
      };

      expect(result).toEqual(prompts);
      expect(prismaMock.promptTemplate.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplate.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("getPromptTemplates - prompts - params.categories defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplates();
      prismaMock.promptTemplate.findMany.mockResolvedValue(prompts);

      const categories = ["cat 1", "cat2", "cat 3"];
      const result = await getPromptTemplates({ categories });

      const expectedFindMayArgs: Prisma.PromptTemplateFindManyArgs = {
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
      };

      expect(result).toEqual(prompts);
      expect(prismaMock.promptTemplate.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplate.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("getPromptTemplates - prompts - params defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplates();
      prismaMock.promptTemplate.findMany.mockResolvedValue(prompts);

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const result = await getPromptTemplates({ search, categories });

      const expectedFindMayArgs: Prisma.PromptTemplateFindManyArgs = {
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
                     contains: search,
                     mode: "insensitive",
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
      };

      expect(result).toEqual(prompts);
      expect(prismaMock.promptTemplate.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplate.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });
});

describe("getPromptTemplateCategories queries tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("getPromptTemplateCategories - categories retrieved - test", async () => {
      const categories = ptestData.pPromptTemplateCategories();
      prismaMock.promptTemplateCategory.findMany.mockResolvedValue(categories);

      const result = await getPromptTemplateCategories();

      const expectedFindMayArgs: Prisma.PromptTemplateCategoryFindManyArgs = {
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
