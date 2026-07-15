import { flatMap, map, uniq } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   PromptCategoryWithCount,
   PromptWithCategories,
   PromptWithContent,
} from "@/data/types/db/prompt";
import {
   DPrompt,
   DPromptCategoriesPage,
   DPromptCategoriesPageQuery,
   DPromptCategory,
   DPromptCategoryUsage,
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
   PromptUpdateArgs,
   PromptUpdateInput,
} from "@/generated/prisma/models";

import {
   toDPrompt,
   toDPromptCategoryUsages,
   toDPromptPreviews,
   toDPrompts,
   toDPromptWithContent,
} from "./prompt.mapper";
import {
   resolveCategoriesWhereInput,
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
         recommendedModel: data.recommendedModel,
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
         recommendedModel: data.recommendedModel,
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

   async pGetPromptCategories(userId: string): Promise<DPromptCategory[]> {
      return await this.prisma.promptCategory.findMany({
         where: { userId },
         select: {
            name: true,
         },
         orderBy: {
            name: "asc",
         },
      });
   }

   async pGePromptCategories(userId: string): Promise<string[]> {
      const descriptors = await this.prisma.prompt.findMany({
         where: { userId },
         include: {
            categories: true,
         },
      });

      const categories = flatMap(descriptors, (d) =>
         map(d.categories, (cat) => cat.name)
      );
      return uniq(categories).sort();
   }

   async pGetPromptModels(userId: string): Promise<string[]> {
      const descriptors = await this.prisma.prompt.findMany({
         where: { userId },
         select: {
            recommendedModel: true,
         },
      });

      const models = map(descriptors, (d) => d.recommendedModel);
      return uniq(models).sort();
   }

   async pGetCategoriesWithUsage(
      userId: string
   ): Promise<DPromptCategoryUsage[]> {
      const categories = (await this.prisma.promptCategory.findMany({
         where: { userId },
         select: {
            id: true,
            name: true,
            _count: {
               select: { prompts: true },
            },
         },
         orderBy: { name: "asc" },
      })) as PromptCategoryWithCount[];

      return toDPromptCategoryUsages(categories);
   }

   async pRenameCategory(
      userId: string,
      categoryId: number,
      name: string
   ): Promise<void> {
      const args: PromptCategoryUpdateArgs = {
         where: { id: categoryId, userId },
         data: { name },
      };

      await this.prisma.promptCategory.update(args);
   }

   async pDeleteCategory(userId: string, categoryId: number): Promise<void> {
      const args: PromptCategoryDeleteArgs = {
         where: { id: categoryId, userId },
      };

      await this.prisma.promptCategory.delete(args);
   }

   async pCategoryNameExists(
      userId: string,
      name: string,
      excludeCategoryId: number
   ): Promise<boolean> {
      const args: PromptCategoryFindFirstArgs = {
         where: {
            userId,
            name: { equals: name, mode: "insensitive" },
            id: { not: excludeCategoryId },
         },
         select: { id: true },
      };

      const existing = await this.prisma.promptCategory.findFirst(args);
      return existing !== null;
   }
}
