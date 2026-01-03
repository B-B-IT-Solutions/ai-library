import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { Prisma } from "@/generated/prisma/client";
import {
   PromptTemplateDescriptorFindFirstArgs,
   PromptTemplateDescriptorFindManyArgs,
} from "@/generated/prisma/models";

import { PromptTemplateRepository } from "./prompt.template";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const repository = new PromptTemplateRepository(prismaMock);

describe("pGetPromptTemplateDescriptors tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetPromptTemplateDescriptors - prompts - params undefined - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptors();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const result = await repository.pGetPromptTemplateDescriptors();

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

   test("pGetPromptTemplateDescriptors - prompts - params empty - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptors();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const result = await repository.pGetPromptTemplateDescriptors({});

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

   test("pGetPromptTemplateDescriptors - prompts - params.search defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptors();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const search = "prompt 1";
      const result = await repository.pGetPromptTemplateDescriptors({
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
                     promptText: {
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

   test("pGetPromptTemplateDescriptors - prompts - params.categories defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptors();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const categories = ["cat 1", "cat2", "cat 3"];
      const result = await repository.pGetPromptTemplateDescriptors({
         categories,
      });

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

   test("pGetPromptTemplateDescriptors - prompts - params defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptors();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const result = await repository.pGetPromptTemplateDescriptors({
         search,
         categories,
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
                     promptText: {
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

describe("pGetPromptTemplateDescriptor tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetPromptTemplateDescriptor - id defined - test", async () => {
      const prompt = ptestData.pPromptDescriptorWithCategories();
      prismaMock.promptTemplateDescriptor.findFirst.mockResolvedValue(prompt);

      const promptTemplateId = "1";
      const result = await repository.pGetPromptTemplateDescriptor(
         promptTemplateId
      );

      const expectedWhere: PromptTemplateDescriptorFindFirstArgs = {
         where: {
            id: promptTemplateId,
         },
         include: {
            categories: true,
         },
      };
      expect(result).toEqual(prompt);
      expect(
         prismaMock.promptTemplateDescriptor.findFirst
      ).toHaveBeenCalledTimes(1);
      expect(
         prismaMock.promptTemplateDescriptor.findFirst
      ).toHaveBeenCalledWith(expectedWhere);
   });
});

describe("pGetPromptTemplateCategories queries tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetPromptTemplateCategories - categories retrieved - test", async () => {
      const categories = ptestData.pPromptTemplateCategories();
      prismaMock.promptTemplateCategory.findMany.mockResolvedValue(categories);

      const result = await repository.pGetPromptTemplateCategories();

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
