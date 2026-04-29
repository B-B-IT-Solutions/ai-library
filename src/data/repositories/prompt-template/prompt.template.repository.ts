import { flatMap, isEmpty, map, uniq } from "es-toolkit/compat";

import { Sort } from "@/data/types/common";
import { DbClient } from "@/data/types/db/common";
import {
   PromptTemplateDescriptorWithCategories,
   PromptTemplateDescriptorWithTemplate,
} from "@/data/types/db/prompt.template";
import {
   DPromptTemplate,
   DPromptTemplateCategory,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateFieldType,
   DPromptTemplateFieldUpdate,
   DPromptTemplateUpdate,
   DTemplateDescriptorsFilter,
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";
import { Prisma } from "@/generated/prisma/client";
import {
   PromptDescriptorOrderByWithRelationInput,
   PromptTemplateDescriptorCountArgs,
   PromptTemplateDescriptorCreateArgs,
   PromptTemplateDescriptorCreateInput,
   PromptTemplateDescriptorDeleteArgs,
   PromptTemplateDescriptorFindManyArgs,
   PromptTemplateDescriptorUpdateArgs,
   PromptTemplateDescriptorUpdateInput,
   PromptTemplateDescriptorWhereInput,
} from "@/generated/prisma/models";

import {
   toDPromptTemplate,
   toDPromptTemplateDescriptor,
   toDPromptTemplateDescriptors,
   toDPromptTemplateDescriptorWithTemplate,
} from "./prompt.template.mapper";

type PGetPromptTemplateDescriptorsParams = {
   search?: string;
   categories?: string[];
};

export class PromptTemplateRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetTemplateDescriptorsPage(
      userId: string,
      query?: DTemplateDescriptorsPageQuery
   ): Promise<DTemplateDescriptorsPage> {
      const pagination = query?.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const where = this.resolveWhereInput(userId, query?.filter);
      const orderBy = this.resolveOrderBy(query?.sort);

      const args: PromptTemplateDescriptorFindManyArgs = {
         where,
         include: {
            categories: true,
         },
         orderBy,
         skip,
         take: pageSize,
      };

      const countArgs: PromptTemplateDescriptorCountArgs = {
         where,
      };

      const [descriptors, totalElements] = await Promise.all([
         this.prisma.promptTemplateDescriptor.findMany(args) as Promise<
            PromptTemplateDescriptorWithCategories[]
         >,
         this.prisma.promptTemplateDescriptor.count(countArgs),
      ]);

      return {
         content: toDPromptTemplateDescriptors(descriptors),
         pageNumber,
         pageSize,
         numberOfElements: descriptors.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements: totalElements,
      };
   }

   async pGetPublicTemplateDescriptorsPage(
      query: DTemplateDescriptorsPageQuery
   ): Promise<DTemplateDescriptorsPage> {
      const pagination = query?.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const where = this.resolveWhereInput(undefined, query?.filter);
      const orderBy = this.resolveOrderBy(query?.sort);

      const args: PromptTemplateDescriptorFindManyArgs = {
         where,
         include: {
            categories: true,
         },
         orderBy,
         skip,
         take: pageSize,
      };

      const countArgs: PromptTemplateDescriptorCountArgs = {
         where,
      };

      const [descriptors, totalElements] = await Promise.all([
         this.prisma.promptTemplateDescriptor.findMany(args) as Promise<
            PromptTemplateDescriptorWithCategories[]
         >,
         this.prisma.promptTemplateDescriptor.count(countArgs),
      ]);

      return {
         content: toDPromptTemplateDescriptors(descriptors),
         pageNumber,
         pageSize,
         numberOfElements: descriptors.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements: totalElements,
      };
   }

   async pGetPromptTemplateDescriptors(
      params?: PGetPromptTemplateDescriptorsParams
   ) {
      const where = this.resolveGetPromptTemplateDescriptorsWhereInput(params);

      const templates = await this.prisma.promptTemplateDescriptor.findMany({
         where: where,
         include: {
            categories: true,
         },
         take: 20,
      });

      return toDPromptTemplateDescriptors(templates);
   }

   async pGetPromptTemplateDescriptorWithTemplate(
      userId: string,
      id: string
   ): Promise<DPromptTemplateDescriptorWithTemplate | null> {
      const template: PromptTemplateDescriptorWithTemplate | null =
         await this.prisma.promptTemplateDescriptor.findFirst({
            where: { id, userId },
            include: {
               categories: true,
               promptTemplate: {
                  include: {
                     fields: true,
                     globalFields: true,
                  },
               },
            },
         });

      if (template) {
         return toDPromptTemplateDescriptorWithTemplate(template);
      }
      return null;
   }

   async pGetPromptTemplate(
      userId: string,
      id: string
   ): Promise<DPromptTemplate | null> {
      const template = await this.prisma.promptTemplate.findFirst({
         where: {
            id,
            promptTemplateDescriptor: { userId },
         },
         include: {
            fields: true,
            globalFields: true,
         },
      });

      return template ? toDPromptTemplate(template) : null;
   }

   async pGetPromptTemplateCategories(
      userId: string
   ): Promise<DPromptTemplateCategory[]> {
      return await this.prisma.promptTemplateCategory.findMany({
         where: { userId },
         select: {
            name: true,
         },
      });
   }

   async pCreatePromptTemplateDescriptor(
      userId: string,
      data: DPromptTemplateUpdate
   ): Promise<DPromptTemplateDescriptor> {
      const input: PromptTemplateDescriptorCreateInput = {
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
                        type: field.type as DPromptTemplateFieldType,
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
         user: {
            connect: {
               id: userId,
            },
         },
      };

      const args: PromptTemplateDescriptorCreateArgs = {
         data: input,
         include: {
            categories: true,
         },
      };
      const newEntry = await this.prisma.promptTemplateDescriptor.create(args);
      return toDPromptTemplateDescriptor(
         newEntry as PromptTemplateDescriptorWithCategories
      );
   }

   async pUpdatePromptTemplateDescriptor(
      userId: string,
      descriptorId: string,
      data: DPromptTemplateUpdate
   ) {
      const input: PromptTemplateDescriptorUpdateInput = {
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

      const args: PromptTemplateDescriptorUpdateArgs = {
         where: { id: descriptorId },
         data: input,
      };

      await this.prisma.promptTemplateDescriptor.update(args);
   }

   async pDeletePromptTemplateDescriptor(userId: string, descriptorId: string) {
      const args: PromptTemplateDescriptorDeleteArgs = {
         where: { id: descriptorId, userId },
      };
      await this.prisma.promptTemplateDescriptor.delete(args);
   }

   async pToggleFavorite(
      userId: string,
      descriptorId: string,
      isFavorite: boolean
   ): Promise<void> {
      const input: PromptTemplateDescriptorUpdateInput = { isFavorite };

      const args: PromptTemplateDescriptorUpdateArgs = {
         where: {
            id: descriptorId,
            userId,
         },
         data: input,
      };

      await this.prisma.promptTemplateDescriptor.update(args);
   }

   async pGetTemplateCategories(userId: string): Promise<string[]> {
      const descriptors = await this.prisma.promptTemplateDescriptor.findMany({
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

   async pGetTemplateModels(userId: string): Promise<string[]> {
      const descriptors = await this.prisma.promptTemplateDescriptor.findMany({
         where: { userId },
         select: {
            recommendedModel: true,
         },
      });

      const models = map(descriptors, (d) => d.recommendedModel);
      return uniq(models).sort();
   }

   private resolveGetPromptTemplateDescriptorsWhereInput(
      params?: PGetPromptTemplateDescriptorsParams
   ): PromptTemplateDescriptorWhereInput | undefined {
      if (isEmpty(params)) {
         return undefined;
      }

      const { search, categories } = params;

      const searchClause:
         | Prisma.PromptTemplateDescriptorWhereInput[]
         | undefined = search
         ? [
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
           ]
         : undefined;

      const isCategories = !isEmpty(categories);
      const categoriesClause:
         | Prisma.PromptTemplateDescriptorWhereInput[]
         | undefined = isCategories
         ? [
              {
                 categories: {
                    some: {
                       name: {
                          in: categories,
                       },
                    },
                 },
              },
           ]
         : undefined;

      return {
         OR: searchClause,
         AND: categoriesClause,
      };
   }

   private resolveWhereInput(
      userId?: string,
      filter?: DTemplateDescriptorsFilter
   ): PromptTemplateDescriptorWhereInput {
      const where: PromptTemplateDescriptorWhereInput = { userId };

      if (!filter) {
         return where;
      }

      // Search
      if (filter.search) {
         where.OR = [
            { title: { contains: filter.search, mode: "insensitive" } },
            { description: { contains: filter.search, mode: "insensitive" } },
         ];
      }

      // Categories
      if (!isEmpty(filter.categories)) {
         where.categories = {
            some: {
               name: {
                  in: filter.categories,
               },
            },
         };
      }

      // Models
      if (!isEmpty(filter.models)) {
         where.recommendedModel = {
            in: filter.models,
         };
      }

      // Favorites
      if (filter.isFavorite !== undefined) {
         where.isFavorite = filter.isFavorite;
      }

      // Collections
      if (filter.collectionIds && filter.collectionIds.length > 0) {
         where.collectionEntries = {
            some: {
               collectionId: {
                  in: filter.collectionIds,
               },
            },
         };
      }

      return where;
   }

   private resolveOrderBy(
      sort?: Sort
   ): PromptDescriptorOrderByWithRelationInput {
      if (sort) {
         return {
            [sort.field]: sort.order,
         };
      }
      return {
         createdAt: "desc" as const,
      };
   }
}
