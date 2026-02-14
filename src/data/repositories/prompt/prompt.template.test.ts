import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { toDPromptTemplateDescriptor } from "@/data/services/prompt/prompt.template.mapper";
import { DPromptTemplateFieldUpdate } from "@/data/types/domain/prompt.template";
import { Prisma } from "@/generated/prisma/client";
import {
   PromptTemplateDescriptorCreateArgs,
   PromptTemplateDescriptorCreateInput,
   PromptTemplateDescriptorFindFirstArgs,
   PromptTemplateDescriptorFindManyArgs,
   PromptTemplateFindFirstArgs,
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

describe("pGetPromptTemplateDescriptorWithTemplate tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetPromptTemplateDescriptorWithTemplate - id defined - test", async () => {
      const prompt = ptestData.pPromptDescriptorWithRelations();
      prismaMock.promptTemplateDescriptor.findFirst.mockResolvedValue(prompt);

      const id = "prompt-template-descriptor-id-1";
      const result =
         await repository.pGetPromptTemplateDescriptorWithTemplate(id);

      const expectedWhere: PromptTemplateDescriptorFindFirstArgs = {
         where: {
            id,
         },
         include: {
            categories: true,
            promptTemplate: {
               include: {
                  fields: true,
               },
            },
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

describe("pGetPromptTemplate tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetPromptTemplate test", async () => {
      const prompt = ptestData.pPromptTemplate();
      prismaMock.promptTemplate.findFirst.mockResolvedValue(prompt);

      const id = "prompt-template-id-1";
      const result = await repository.pGetPromptTemplate(id);

      const expectedWhere: PromptTemplateFindFirstArgs = {
         where: { id },
         include: {
            fields: true,
         },
      };
      expect(result).toEqual(prompt);
      expect(prismaMock.promptTemplate.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplate.findFirst).toHaveBeenCalledWith(
         expectedWhere
      );
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

describe("pCreatePromptTemplateDescriptor tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pCreatePromptTemplateDescriptor - descriptor created - test", async () => {
      const data = dtestData.dPromptTemplateUpdate();
      const newDescriptor = ptestData.pPromptTemplateDescriptorWithCategories();
      prismaMock.promptTemplateDescriptor.create.mockResolvedValue(
         newDescriptor
      );

      const result = await repository.pCreatePromptTemplateDescriptor(data);

      const expectedResult = toDPromptTemplateDescriptor(newDescriptor);

      const expectedInput: PromptTemplateDescriptorCreateInput = {
         title: data.title,
         description: data.description,
         recommendedModel: data.recommendedModel,
         categories: {
            connectOrCreate: map(data.categories, (categoryName: string) => ({
               where: {
                  name: categoryName,
               },
               create: {
                  name: categoryName,
               },
            })),
         },
         promptTemplate: {
            create: {
               content: data.content,
               detailedDescription: data.detailedDescription,
               fields: {
                  create: map(
                     data.fields,
                     (field: DPromptTemplateFieldUpdate) => ({
                        name: field.name,
                        label: field.label,
                        description: field.description,
                        type: field.type,
                        required: field.required,
                        order: field.order,
                        defaultValue: field.defaultValue,
                        options: field.options
                           ? JSON.stringify(field.options)
                           : undefined,
                     })
                  ),
               },
            },
         },
      };

      const expectedCreateArgs: PromptTemplateDescriptorCreateArgs = {
         data: expectedInput,
         include: {
            categories: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.promptTemplateDescriptor.create).toHaveBeenCalledTimes(
         1
      );
      expect(prismaMock.promptTemplateDescriptor.create).toHaveBeenCalledWith(
         expectedCreateArgs
      );
   });
});
