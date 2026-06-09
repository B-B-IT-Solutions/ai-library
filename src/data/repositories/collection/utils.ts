import { Sort } from "@/data/types/common";
import { DCollectionsFilter } from "@/data/types/domain/collection";
import {
   LibraryCollectionOrderByWithRelationInput,
   LibraryCollectionWhereInput,
} from "@/generated/prisma/models";

export const resolveWhereInput = (
   userId?: string,
   filter?: DCollectionsFilter
): LibraryCollectionWhereInput => {
   const where: LibraryCollectionWhereInput = { userId };

   if (!filter) {
      return where;
   }

   if (filter.search) {
      where.OR = [
         { name: { contains: filter.search, mode: "insensitive" } },
         { description: { contains: filter.search, mode: "insensitive" } },
      ];
   }

   return where;
};

export const resolveOrderBy = (
   sort?: Sort
): LibraryCollectionOrderByWithRelationInput => {
   if (sort) {
      return { [sort.field]: sort.order };
   }
   return { createdAt: "desc" };
};
