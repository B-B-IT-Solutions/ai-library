import { trim } from "es-toolkit";
import { map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   PromptWithCategories,
   PromptWithContent,
} from "@/data/types/db/prompt";
import {
   DPrompt,
   DPromptCategoriesPage,
   DPromptCategoriesPageQuery,
   DPromptCategoryUpdate,
   DPromptCategoryWithUsage,
   DPromptModelsPage,
   DPromptModelsPageQuery,
   DPromptModelUpdate,
   DPromptModelWithUsage,
   DPromptPreviewsPage,
   DPromptPreviewsPageQuery,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptUpdate,
   DPromptVariableType,
   DPromptVariableUpdate,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import {
   PromptCategoryCountArgs,
   PromptCategoryCreateArgs,
   PromptCategoryDeleteArgs,
   PromptCategoryFindFirstArgs,
   PromptCategoryFindManyArgs,
   PromptCategoryUpdateArgs,
   PromptCategoryWhereInput,
   PromptCountArgs,
   PromptCreateArgs,
   PromptCreateInput,
   PromptDeleteArgs,
   PromptFindManyArgs,
   PromptModelCountArgs,
   PromptModelCreateArgs,
   PromptModelDeleteArgs,
   PromptModelFindFirstArgs,
   PromptModelFindManyArgs,
   PromptModelUpdateArgs,
   PromptModelWhereInput,
   PromptUpdateArgs,
   PromptUpdateInput,
} from "@/generated/prisma/models";

import {
   toDPrompt,
   toDPromptCategoriesWithUsage,
   toDPromptModelsWithUsage,
   toDPromptPreviews,
   toDPrompts,
   toDPromptWithContent,
} from "./prompt.mapper";
import {
   resolveCategoriesWhereInput,
   resolveModelsWhereInput,
   resolvePromptOrderBy,
   resolvePromptWhereInput,
} from "./utils";

export class PromptRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetPromptsPage(
      userId: string,
      query?: DPromptsPageQuery
   ): Promise<DPromptsPage> {
      const pagination = query?.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const where = resolvePromptWhereInput(userId, query?.filter);
      const orderBy = resolvePromptOrderBy(query?.sort);

      const args: PromptFindManyArgs = {
         where,
         include: {
            categories: true,
            model: true,
         },
         orderBy,
         skip,
         take: pageSize,
      };

      const countArgs: PromptCountArgs = {
         where,
      };

      const [prompts, totalElements] = await Promise.all([
         this.prisma.prompt.findMany(args) as Promise<PromptWithCategories[]>,
         this.prisma.prompt.count(countArgs),
      ]);

      return {
         content: toDPrompts(prompts),
         pageNumber,
         pageSize,
         numberOfElements: prompts.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements: totalElements,
      };
   }

   async pGetPromptPreviewsPage(
      userId: string,
      query?: DPromptPreviewsPageQuery
   ): Promise<DPromptPreviewsPage> {
      const pagination = query?.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const where = resolvePromptWhereInput(userId, query?.filter);
      const orderBy = resolvePromptOrderBy(query?.sort);

      const args = {
         where,
         select: {
            id: true,
            title: true,
         },
         orderBy,
         skip,
         take: pageSize,
      } satisfies PromptFindManyArgs;

      const countArgs = {
         where,
      } satisfies PromptCountArgs;

      const [prompts, totalElements] = await Promise.all([
         this.prisma.prompt.findMany(args),
         this.prisma.prompt.count(countArgs),
      ]);

      return {
         content: toDPromptPreviews(prompts),
         pageNumber,
         pageSize,
         numberOfElements: prompts.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements: totalElements,
      };
   }

   async pGetPrompt(userId: string, id: string): Promise<DPrompt | null> {
      const template: PromptWithCategories | null =
         await this.prisma.prompt.findFirst({
            where: { id, userId },
            include: {
               categories: true,
               model: true,
            },
         });

      if (template) {
         return toDPrompt(template);
      }
      return null;
   }

   async pGetPromptContent(
      userId: string,
      id: string
   ): Promise<DPromptWithContent | null> {
      const prompt = await this.prisma.prompt.findFirst({
         where: { id, userId },
         include: {
            content: true,
            categories: true,
            model: true,
            fields: true,
            globalFields: true,
         },
      });

      return prompt ? toDPromptWithContent(prompt as PromptWithContent) : null;
   }

   async pCreatePrompt(userId: string, data: DPromptUpdate): Promise<DPrompt> {
      const input: PromptCreateInput = {
         title: data.title,
         description: data.description,
         model: {
            connectOrCreate: {
               where: {
                  userId_name: { userId, name: data.recommendedModel },
               },
               create: {
                  name: data.recommendedModel,
                  userId,
               },
            },
         },
         categories: {
            connectOrCreate: map(data.categories, (catName) => ({
               where: {
                  userId_name: { userId, name: catName },
               },
               create: {
                  name: catName,
                  userId,
               },
            })),
         },
         content: {
            create: {
               content: data.content,
            },
         },
         fields: {
            create: map(data.fields, (field: DPromptVariableUpdate) => ({
               name: field.name,
               label: field.label,
               description: field.description,
               type: field.type as DPromptVariableType,
               required: field.required,
               order: field.order,
               defaultValue: field.defaultValue,
               options: field.options,
            })),
         },
         globalFields: {
            create: map(data.globalFieldIds, (id, idx) => ({
               globalFieldId: id,
               order: idx,
            })),
         },
         user: {
            connect: {
               id: userId,
            },
         },
      };

      const args: PromptCreateArgs = {
         data: input,
         include: {
            categories: true,
            model: true,
         },
      };
      const newEntry = await this.prisma.prompt.create(args);
      return toDPrompt(newEntry as PromptWithCategories);
   }

   async pUpdatePrompt(
      userId: string,
      descriptorId: string,
      data: DPromptUpdate
   ) {
      const input: PromptUpdateInput = {
         title: data.title,
         description: data.description,
         model: {
            connectOrCreate: {
               where: { userId_name: { userId, name: data.recommendedModel } },
               create: { name: data.recommendedModel, userId },
            },
         },
         categories: {
            set: [],
            connectOrCreate: map(data.categories, (catName) => ({
               where: { userId_name: { userId, name: catName } },
               create: { name: catName, userId },
            })),
         },
         content: {
            update: {
               content: data.content,
            },
         },
         fields: {
            deleteMany: {},
            create: map(data.fields, (field: DPromptVariableUpdate) => ({
               name: field.name,
               label: field.label,
               description: field.description,
               type: field.type as DPromptVariableType,
               required: field.required,
               order: field.order,
               defaultValue: field.defaultValue,
               options: field.options,
            })),
         },
         globalFields: {
            deleteMany: {},
            create: map(data.globalFieldIds, (id, idx) => ({
               globalFieldId: id,
               order: idx,
            })),
         },
      };

      const args: PromptUpdateArgs = {
         where: { id: descriptorId },
         data: input,
      };

      await this.prisma.prompt.update(args);
   }

   async pDeletePrompt(userId: string, descriptorId: string) {
      const args: PromptDeleteArgs = {
         where: { id: descriptorId, userId },
      };
      await this.prisma.prompt.delete(args);
   }

   async pGetPromptsCount(userId: string): Promise<number> {
      const args: PromptCountArgs = {
         where: { userId },
      };
      return await this.prisma.prompt.count(args);
   }

   async pToggleFavorite(
      userId: string,
      descriptorId: string,
      isFavorite: boolean
   ): Promise<void> {
      const input: PromptUpdateInput = { isFavorite };

      const args: PromptUpdateArgs = {
         where: {
            id: descriptorId,
            userId,
         },
         data: input,
      };

      await this.prisma.prompt.update(args);
   }

   async pGetPromptCategoriesPage(
      userId: string,
      query?: DPromptCategoriesPageQuery
   ): Promise<DPromptCategoriesPage> {
      const pagination = query?.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const where: PromptCategoryWhereInput = resolveCategoriesWhereInput(
         userId,
         query?.filter
      );

      const args = {
         where,
         select: {
            name: true,
         },
         orderBy: {
            name: "asc",
         },
         skip,
         take: pageSize,
      } as PromptCategoryFindManyArgs;

      const countArgs = {
         where,
      } as PromptCategoryCountArgs;

      const [categories, totalElements] = await Promise.all([
         this.prisma.promptCategory.findMany(args),
         this.prisma.promptCategory.count(countArgs),
      ]);

      const content = map(categories, (c) => c.name);

      return {
         content,
         pageNumber,
         pageSize,
         numberOfElements: content.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements: totalElements,
      };
   }

   async pGetPromptCategories(userId: string): Promise<string[]> {
      const args = {
         where: { userId },
         select: {
            name: true,
         },
         orderBy: {
            name: "asc",
         },
      } satisfies PromptCategoryFindManyArgs;

      const categories = await this.prisma.promptCategory.findMany(args);
      return map(categories, (c) => c.name);
   }

   async pGetPromptCategoriesWithUsage(
      userId: string
   ): Promise<DPromptCategoryWithUsage[]> {
      const args = {
         where: { userId },
         select: {
            id: true,
            name: true,
            _count: {
               select: { prompts: true },
            },
         },
         orderBy: { name: "asc" },
      } satisfies PromptCategoryFindManyArgs;

      const categories = await this.prisma.promptCategory.findMany(args);
      return toDPromptCategoriesWithUsage(categories);
   }

   async pCreatePromptCategory(
      userId: string,
      update: DPromptCategoryUpdate
   ): Promise<void> {
      const args = {
         data: {
            userId,
            name: trim(update.name),
         },
      } satisfies PromptCategoryCreateArgs;

      await this.prisma.promptCategory.create(args);
   }

   async pUpdatePromptCategory(
      userId: string,
      categoryId: number,
      update: DPromptCategoryUpdate
   ): Promise<void> {
      const args = {
         where: {
            id: categoryId,
            userId,
         },
         data: {
            name: trim(update.name),
         },
      } satisfies PromptCategoryUpdateArgs;

      await this.prisma.promptCategory.update(args);
   }

   async pDeletePromptCategory(
      userId: string,
      categoryId: number
   ): Promise<void> {
      const args = {
         where: { id: categoryId, userId },
      } satisfies PromptCategoryDeleteArgs;

      await this.prisma.promptCategory.delete(args);
   }

   async pPromptCategoryExists(
      userId: string,
      name: string,
      excludeCategoryId?: number
   ): Promise<boolean> {
      const idWhere = excludeCategoryId
         ? { not: excludeCategoryId }
         : undefined;

      const args = {
         where: {
            userId,
            name: { equals: name, mode: "insensitive" },
            id: idWhere,
         },
         select: { id: true },
      } satisfies PromptCategoryFindFirstArgs;

      const existing = await this.prisma.promptCategory.findFirst(args);
      return existing !== null;
   }

   async pGetPromptModels(userId: string): Promise<string[]> {
      const args = {
         where: { userId },
         select: {
            name: true,
         },
         orderBy: {
            name: "asc",
         },
      } satisfies PromptModelFindManyArgs;

      const models = await this.prisma.promptModel.findMany(args);
      return map(models, (m) => m.name);
   }

   async pGetPromptModelsPage(
      userId: string,
      query?: DPromptModelsPageQuery
   ): Promise<DPromptModelsPage> {
      const pagination = query?.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const where: PromptModelWhereInput = resolveModelsWhereInput(
         userId,
         query?.filter
      );

      const args = {
         where,
         select: {
            name: true,
         },
         orderBy: {
            name: "asc",
         },
         skip,
         take: pageSize,
      } as PromptModelFindManyArgs;

      const countArgs = {
         where,
      } as PromptModelCountArgs;

      const [models, totalElements] = await Promise.all([
         this.prisma.promptModel.findMany(args),
         this.prisma.promptModel.count(countArgs),
      ]);

      const content = map(models, (m) => m.name);

      return {
         content,
         pageNumber,
         pageSize,
         numberOfElements: content.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements: totalElements,
      };
   }

   async pGetPromptModelsWithUsage(
      userId: string
   ): Promise<DPromptModelWithUsage[]> {
      const args = {
         where: { userId },
         select: {
            id: true,
            name: true,
            _count: {
               select: { prompts: true },
            },
         },
         orderBy: { name: "asc" },
      } satisfies PromptModelFindManyArgs;

      const models = await this.prisma.promptModel.findMany(args);
      return toDPromptModelsWithUsage(models);
   }

   async pCreatePromptModel(
      userId: string,
      update: DPromptModelUpdate
   ): Promise<void> {
      const args = {
         data: {
            userId,
            name: trim(update.name),
         },
      } satisfies PromptModelCreateArgs;

      await this.prisma.promptModel.create(args);
   }

   async pUpdatePromptModel(
      userId: string,
      modelId: number,
      update: DPromptModelUpdate
   ): Promise<void> {
      const args = {
         where: {
            id: modelId,
            userId,
         },
         data: {
            name: trim(update.name),
         },
      } satisfies PromptModelUpdateArgs;

      await this.prisma.promptModel.update(args);
   }

   async pDeletePromptModel(userId: string, modelId: number): Promise<void> {
      const args = {
         where: { id: modelId, userId },
      } satisfies PromptModelDeleteArgs;

      await this.prisma.promptModel.delete(args);
   }

   async pPromptModelExists(
      userId: string,
      name: string,
      excludeModelId?: number
   ): Promise<boolean> {
      const idWhere = excludeModelId ? { not: excludeModelId } : undefined;

      const args = {
         where: {
            userId,
            name: { equals: name, mode: "insensitive" },
            id: idWhere,
         },
         select: { id: true },
      } satisfies PromptModelFindFirstArgs;

      const existing = await this.prisma.promptModel.findFirst(args);
      return existing !== null;
   }
}
