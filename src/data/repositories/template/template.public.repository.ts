import { isEmpty } from "es-toolkit/compat";

import { Sort } from "@/data/types/common";
import { DbClient } from "@/data/types/db/common";
import { PromptTemplateDescriptorWithCategories } from "@/data/types/db/prompt.template";
import {
   DTemplateDescriptorsFilter,
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";
import {
   PromptDescriptorOrderByWithRelationInput,
   PromptTemplateDescriptorCountArgs,
   PromptTemplateDescriptorFindManyArgs,
   PromptTemplateDescriptorWhereInput,
} from "@/generated/prisma/models";

import { toDPromptTemplateDescriptors } from "./template.mapper";

export class PublicTemplateRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
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

   // async pGetPublicCollectionTemplates(
   //    collectionId: string
   // ): Promise<DPromptTemplateDescriptor[]> {
   //    const entries = await this.prisma.libraryCollectionEntry.findMany({
   //       where: { collectionId },
   //       include: {
   //          templateDescriptor: {
   //             include: {
   //                categories: true,
   //             },
   //          },
   //       },
   //       orderBy: {
   //          addedAt: "asc",
   //       },
   //    });

   //    return entries.map((e) => e.templateDescriptor);
   // }

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
