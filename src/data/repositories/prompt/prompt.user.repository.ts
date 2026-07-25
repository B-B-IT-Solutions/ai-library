import { trim } from "es-toolkit";
import { map } from "es-toolkit/compat";

import { Pagination } from "@/data/types/common";
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
   DPromptUpdateOptions,
   DPromptVariableType,
   DPromptVariableUpdate,
   DPromptVersion,
   DPromptVersionsPage,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { PrismaClient } from "@/generated/prisma/client";
import {
   PromptCategoryCountArgs,
   PromptCategoryCreateArgs,
   PromptCategoryDeleteArgs,
   PromptCategoryFindFirstArgs,
   PromptCategoryFindManyArgs,
   PromptCategoryUpdateArgs,
   PromptCategoryWhereInput,
   PromptContentVersionCountArgs,
   PromptContentVersionFindFirstArgs,
   PromptContentVersionFindManyArgs,
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
   toDPromptVersion,
   toDPromptVersionSummaries,
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
                  userId_name: { userId, name: data.model },
               },
               create: {
                  name: data.model,
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

   /**
    * Updates title/description/model/categories/fields/globalFields/content of a
    * prompt. When `versionOptions.saveAsVersion` is set, the content that is being
    * REPLACED (i.e. the value of `PromptContent.content` *before* this update) is
    * archived as a new `PromptContentVersion` row first, in the same transaction as
    * the content update — this is the single "snapshot the outgoing content" rule
    * that both a normal editor save-as-version and `pRestorePromptContent` rely on
    * (see prompt-content-versioning-feature-spec.md, §3.3/§6.3).
    */
   async pUpdatePromptWithVersioning(
      userId: string,
      descriptorId: string,
      data: DPromptUpdate,
      versionOptions?: DPromptUpdateOptions,
      maxStoredVersions?: number
   ): Promise<void> {
      const client = this.transactionCapableClient();

      await client.$transaction(async (tx) => {
         if (versionOptions?.saveAsVersion) {
            await this.archiveCurrentContentAsVersion(
               tx,
               descriptorId,
               versionOptions.versionNote,
               maxStoredVersions
            );
         }

         await this.applyPromptUpdate(tx, userId, descriptorId, data);
      });
   }

   /**
    * Restores a prompt's content to a previous version's content. Unlike
    * `pUpdatePromptWithVersioning`, this only ever touches `PromptContent.content` —
    * title/description/model/categories/fields/globalFields are intentionally left
    * untouched, since a restore is only about the prompt text.
    */
   async pRestorePromptContent(
      descriptorId: string,
      newContent: string,
      versionOptions?: DPromptUpdateOptions,
      maxStoredVersions?: number
   ): Promise<void> {
      const client = this.transactionCapableClient();

      await client.$transaction(async (tx) => {
         if (versionOptions?.saveAsVersion) {
            await this.archiveCurrentContentAsVersion(
               tx,
               descriptorId,
               versionOptions.versionNote,
               maxStoredVersions
            );
         }

         await tx.promptContent.update({
            where: { promptId: descriptorId },
            data: { content: newContent },
         });
      });
   }

   async pGetPromptVersionsPage(
      descriptorId: string,
      pagination?: Pagination
   ): Promise<DPromptVersionsPage> {
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const args = {
         where: { promptId: descriptorId },
         select: {
            id: true,
            promptId: true,
            versionNumber: true,
            note: true,
            createdAt: true,
         },
         orderBy: { versionNumber: "desc" },
         skip,
         take: pageSize,
      } satisfies PromptContentVersionFindManyArgs;

      const countArgs = {
         where: { promptId: descriptorId },
      } satisfies PromptContentVersionCountArgs;

      const [versions, totalElements] = await Promise.all([
         this.prisma.promptContentVersion.findMany(args),
         this.prisma.promptContentVersion.count(countArgs),
      ]);

      return {
         content: toDPromptVersionSummaries(versions),
         pageNumber,
         pageSize,
         numberOfElements: versions.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements,
      };
   }

   async pGetPromptVersion(
      userId: string,
      descriptorId: string,
      versionId: string
   ): Promise<DPromptVersion | null> {
      const args = {
         where: {
            id: versionId,
            promptId: descriptorId,
            prompt: { userId },
         },
      } satisfies PromptContentVersionFindFirstArgs;

      const version = await this.prisma.promptContentVersion.findFirst(args);
      return version ? toDPromptVersion(version) : null;
   }

   async pGetLatestPromptVersionContent(
      descriptorId: string
   ): Promise<string | null> {
      const args = {
         where: { promptId: descriptorId },
         orderBy: { versionNumber: "desc" },
         select: { content: true },
      } satisfies PromptContentVersionFindFirstArgs;

      const version = await this.prisma.promptContentVersion.findFirst(args);
      return version?.content ?? null;
   }

   private async archiveCurrentContentAsVersion(
      tx: DbClient,
      descriptorId: string,
      versionNote?: string,
      maxStoredVersions?: number
   ): Promise<void> {
      const current = await tx.promptContent.findUnique({
         where: { promptId: descriptorId },
      });

      if (!current) {
         return;
      }

      const lastVersion = await tx.promptContentVersion.findFirst({
         where: { promptId: descriptorId },
         orderBy: { versionNumber: "desc" },
      });
      const nextVersionNumber = (lastVersion?.versionNumber ?? 0) + 1;

      await tx.promptContentVersion.create({
         data: {
            promptId: descriptorId,
            versionNumber: nextVersionNumber,
            content: current.content,
            note: versionNote || null,
         },
      });

      if (maxStoredVersions !== undefined && maxStoredVersions !== -1) {
         await this.rotateVersionsIfNeeded(tx, descriptorId, maxStoredVersions);
      }
   }

   private async rotateVersionsIfNeeded(
      tx: DbClient,
      descriptorId: string,
      maxStoredVersions: number
   ): Promise<void> {
      const totalVersions = await tx.promptContentVersion.count({
         where: { promptId: descriptorId },
      });

      const excess = totalVersions - maxStoredVersions;
      if (excess <= 0) {
         return;
      }

      const oldestVersions = await tx.promptContentVersion.findMany({
         where: { promptId: descriptorId },
         orderBy: { versionNumber: "asc" },
         take: excess,
         select: { id: true },
      });

      await tx.promptContentVersion.deleteMany({
         where: { id: { in: map(oldestVersions, (v) => v.id) } },
      });
   }

   private async applyPromptUpdate(
      tx: DbClient,
      userId: string,
      descriptorId: string,
      data: DPromptUpdate
   ): Promise<void> {
      const input: PromptUpdateInput = {
         title: data.title,
         description: data.description,
         model: {
            connectOrCreate: {
               where: { userId_name: { userId, name: data.model } },
               create: { name: data.model, userId },
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

      await tx.prompt.update(args);
   }

   /**
    * `this.prisma` is typed as `PrismaClient | Prisma.TransactionClient` so that
    * repositories can also be bound to an outer transaction (see `DbClient`).
    * `Prisma.TransactionClient` never has `$transaction` itself (Prisma disallows
    * nesting transactions) — in practice `PromptRepository` is always constructed
    * with the top-level client for these entry points, so this cast is safe.
    */
   private transactionCapableClient(): PrismaClient {
      return this.prisma as PrismaClient;
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
