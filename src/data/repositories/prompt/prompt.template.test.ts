import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { Prisma } from "@/generated/prisma/client";
import { PromptTemplateDescriptorFindManyArgs } from "@/generated/prisma/models";

import {
   getPromptTemplateCategories,
   getPromptTemplateDescriptors,
} from "./prompt.template";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("getPromptTemplates tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("getPromptTemplates - prompts - params undefined - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptors();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const result = await getPromptTemplateDescriptors();

      const expectedFindMayArgs: PromptTemplateDescriptorFindManyArgs = {
         include: {
            categories: true,
         },
         take: 20,
      };

      expect(result).toEqual(prompts);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("getPromptTemplates - prompts - params empty - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptors();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const result = await getPromptTemplateDescriptors({});

      const expectedFindMayArgs: PromptTemplateDescriptorFindManyArgs = {
         include: {
            categories: true,
         },
         take: 20,
      };

      expect(result).toEqual(prompts);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("getPromptTemplates - prompts - params.search defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptors();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const search = "prompt 1";
      const result = await getPromptTemplateDescriptors({
         search,
         categories: [],
      });

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
                  promptTemplate: {
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

      expect(result).toEqual(prompts);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("getPromptTemplates - prompts - params.categories defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptors();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const categories = ["cat 1", "cat2", "cat 3"];
      const result = await getPromptTemplateDescriptors({ categories });

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

      expect(result).toEqual(prompts);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("getPromptTemplates - prompts - params defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptors();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const result = await getPromptTemplateDescriptors({ search, categories });

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
                  promptTemplate: {
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

      expect(result).toEqual(prompts);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
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
