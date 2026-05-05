import { isEmpty } from "es-toolkit/compat";

import { Sort } from "@/data/types/common";
import { DCatalogEntriesFilter } from "@/data/types/domain/catalog";
import {
   CatalogEntryOrderByWithRelationInput,
   CatalogEntryWhereInput,
} from "@/generated/prisma/models";

export const resolveWhereInput = (
   filter?: DCatalogEntriesFilter
): CatalogEntryWhereInput => {
   const where: CatalogEntryWhereInput = { status: "PUBLISHED" };

   if (!filter) {
      return where;
   }

   if (filter.search) {
      where.OR = [
         {
            title: {
               contains: filter.search,
               mode: "insensitive",
            },
         },
         {
            description: {
               contains: filter.search,
               mode: "insensitive",
            },
         },
      ];
   }

   if (!isEmpty(filter.categories)) {
      where.category = {
         slug: {
            in: filter.categories,
         },
      };
   }

   return where;
};

export const resolveOrderBy = (
   sort?: Sort
): CatalogEntryOrderByWithRelationInput => {
   if (sort) {
      return {
         [sort.field]: sort.order,
      };
   }
   return {
      createdAt: "desc" as const,
   };
};
