import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   DPromptTemplateFieldType,
   DPromptTemplateFieldUpdate,
} from "@/data/types/domain/prompt.template";
import { Prisma } from "@/generated/prisma/client";
import {
   PromptTemplateDescriptorCreateArgs,
   PromptTemplateDescriptorCreateInput,
   PromptTemplateDescriptorFindFirstArgs,
   PromptTemplateDescriptorFindManyArgs,
   PromptTemplateDescriptorUpdateArgs,
   PromptTemplateDescriptorUpdateInput,
   PromptTemplateFindFirstArgs,
} from "@/generated/prisma/models";

import {
   toDPromptTemplate,
   toDPromptTemplateDescriptor,
   toDPromptTemplateDescriptors,
   toDPromptTemplateDescriptorWithTemplate,
} from "./prompt.template.mapper";
import { PromptTemplateRepository } from "./prompt.template.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const repository = new PromptTemplateRepository(prismaMock);

describe("pGetPromptTemplateDescriptors tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetPromptTemplateDescriptors - prompts - params undefined - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const result = await repository.pGetPromptTemplateDescriptors();

      const expectedResult = toDPromptTemplateDescriptors(prompts);

      const expectedFindMayArgs: PromptTemplateDescriptorFindManyArgs = {
         include: {
            categories: true,
         },
         take: 20,
      };

      expect(result).toEqual(expectedResult);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("pGetPromptTemplateDescriptors - prompts - params empty - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const result = await repository.pGetPromptTemplateDescriptors({});

      const expectedResult = toDPromptTemplateDescriptors(prompts);

      const expectedFindMayArgs: PromptTemplateDescriptorFindManyArgs = {
         include: {
            categories: true,
         },
         take: 20,
      };

      expect(result).toEqual(expectedResult);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("pGetPromptTemplateDescriptors - prompts - params.search defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const search = "prompt 1";
      const result = await repository.pGetPromptTemplateDescriptors({
         search,
         categories: [],
      });

      const expectedResult = toDPromptTemplateDescriptors(prompts);

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

      expect(result).toEqual(expectedResult);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("pGetPromptTemplateDescriptors - prompts - params.categories defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const categories = ["cat 1", "cat2", "cat 3"];
      const result = await repository.pGetPromptTemplateDescriptors({
         categories,
      });

      const expectedResult = toDPromptTemplateDescriptors(prompts);

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

      expect(result).toEqual(expectedResult);
      expect(
         prismaMock.promptTemplateDescriptor.findMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.promptTemplateDescriptor.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });

   test("pGetPromptTemplateDescriptors - prompts - params defined  - retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplateDescriptorsWithCategories();
      prismaMock.promptTemplateDescriptor.findMany.mockResolvedValue(prompts);

      const search = "prompt 123";
      const categories = ["cat 1", "cat2", "cat 3"];
      const result = await repository.pGetPromptTemplateDescriptors({
         search,
         categories,
      });

      const expectedResult = toDPromptTemplateDescriptors(prompts);

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

      expect(result).toEqual(expectedResult);
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

   test("pGetPromptTemplateDescriptorWithTemplate - descriptor null - test", async () => {
      prismaMock.promptTemplateDescriptor.findFirst.mockResolvedValue(null);

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
                  globalFields: true,
               },
            },
         },
      };
      expect(result).toBeNull();
      expect(
         prismaMock.promptTemplateDescriptor.findFirst
      ).toHaveBeenCalledTimes(1);
      expect(
         prismaMock.promptTemplateDescriptor.findFirst
      ).toHaveBeenCalledWith(expectedWhere);
   });

   test("pGetPromptTemplateDescriptorWithTemplate - descriptor retrieved - test", async () => {
      const template = ptestData.pPromptTemplateDescriptorWithTemplate();
      prismaMock.promptTemplateDescriptor.findFirst.mockResolvedValue(template);

      const id = "prompt-template-descriptor-id-1";
      const result =
         await repository.pGetPromptTemplateDescriptorWithTemplate(id);

      const expectedResult = toDPromptTemplateDescriptorWithTemplate(template);

      const expectedWhere: PromptTemplateDescriptorFindFirstArgs = {
         where: {
            id,
         },
         include: {
            categories: true,
            promptTemplate: {
               include: {
                  fields: true,
                  globalFields: true,
               },
            },
         },
      };
      expect(result).toEqual(expectedResult);
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

   test("pGetPromptTemplate - template null - test", async () => {
      prismaMock.promptTemplate.findFirst.mockResolvedValue(null);

      const id = "prompt-template-id-1";
      const result = await repository.pGetPromptTemplate(id);

      const expectedWhere: PromptTemplateFindFirstArgs = {
         where: { id },
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

   test("pGetPromptTemplate - template retrieved - test", async () => {
      const prompt = ptestData.pPromptTemplate();
      prismaMock.promptTemplate.findFirst.mockResolvedValue(prompt);

      const id = "prompt-template-id-1";
      const result = await repository.pGetPromptTemplate(id);
      const expectedResult = toDPromptTemplate(prompt);

      const expectedWhere: PromptTemplateFindFirstArgs = {
         where: { id },
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

describe("pGetPromptTemplateCategories queries tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetPromptTemplateCategories - categories retrieved - test", async () => {
      const userId = "user-id-1";
      const categories = ptestData.pPromptTemplateCategories();
      prismaMock.promptTemplateCategory.findMany.mockResolvedValue(categories);

      const result = await repository.pGetPromptTemplateCategories(userId);

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
                        options: field.options,
                     })
                  ),
               },
               globalFields: {
                  create: map(data.globalFieldIds, (id, idx) => ({
                     globalFieldId: id,
                     order: idx,
                  })),
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

describe("pUpdatePromptTemplateDescriptor tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pUpdatePromptTemplateDescriptor - descriptor updated - test", async () => {
      const data = dtestData.dPromptTemplateUpdate();
      const descriptor = ptestData.pPromptTemplateDescriptorWithCategories();

      await repository.pUpdatePromptTemplateDescriptor(descriptor.id, data);

      const expectedInput: PromptTemplateDescriptorUpdateInput = {
         title: data.title,
         description: data.description,
         recommendedModel: data.recommendedModel,
         categories: {
            set: [],
            connectOrCreate: map(data.categories, (categoryName) => ({
               where: { name: categoryName },
               create: { name: categoryName },
            })),
         },
         promptTemplate: {
            update: {
               content: data.content,
               fields: {
                  deleteMany: {},
                  create: map(
                     data.fields,
                     (field: DPromptTemplateFieldUpdate) => ({
                        name: field.name,
                        label: field.label,
                        description: field.description,
                        type: field.type as DPromptTemplateFieldType,
                        required: field.required,
                        order: field.order,
                        defaultValue: field.defaultValue,
                        options: field.options,
                     })
                  ),
               },
               globalFields: {
                  deleteMany: {},
                  create: map(data.globalFieldIds, (id, idx) => ({
                     globalFieldId: id,
                     order: idx,
                  })),
               },
            },
         },
      };

      const expectedUpdateArgs: PromptTemplateDescriptorUpdateArgs = {
         where: { id: descriptor.id },
         data: expectedInput,
      };

      expect(prismaMock.promptTemplateDescriptor.update).toHaveBeenCalledTimes(
         1
      );
      expect(prismaMock.promptTemplateDescriptor.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });
});
