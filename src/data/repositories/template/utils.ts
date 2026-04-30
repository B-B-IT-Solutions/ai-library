import { isEmpty } from "es-toolkit/compat";

import { Sort } from "@/data/types/common";
import { DTemplateDescriptorsFilter } from "@/data/types/domain/prompt.template";
import {
   PromptDescriptorOrderByWithRelationInput,
   PromptTemplateDescriptorWhereInput,
} from "@/generated/prisma/models";

export const resolveWhereInput = (
   userId?: string,
   filter?: DTemplateDescriptorsFilter
): PromptTemplateDescriptorWhereInput => {
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
};

export const resolveOrderBy = (
   sort?: Sort
): PromptDescriptorOrderByWithRelationInput => {
   if (sort) {
      return {
         [sort.field]: sort.order,
      };
   }
   return {
      createdAt: "desc" as const,
   };
};
