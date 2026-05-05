import { map } from "es-toolkit/compat";

import { CatalogEntryWithRelations } from "@/data/types/db/catalog";
import { DbClient } from "@/data/types/db/common";
import {
   DCatalogEntriesPage,
   DCatalogEntriesPageQuery,
   DCatalogEntry,
   DCatalogEntryCategory,
} from "@/data/types/domain/catalog";
import {
   CatalogEntryCountArgs,
   CatalogEntryFindManyArgs,
} from "@/generated/prisma/models";

import {
   toDCatalogCategory,
   toDCatalogEntry,
   toDCatalogEntrySummaries,
} from "./catalog.mapper";
import { resolveOrderBy, resolveWhereInput } from "./utils";

export class CatalogRepository {
   constructor(private readonly prisma: DbClient) {}

   async pGetPublishedEntriesPage(
      query?: DCatalogEntriesPageQuery
   ): Promise<DCatalogEntriesPage> {
      const pagination = query?.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 12;
      const skip = pageNumber * pageSize;

      const sort = query?.sort;
      const filter = query?.filter;

      const where = resolveWhereInput(filter);
      const orderBy = resolveOrderBy(sort);

      const findManyArgs = {
         where,
         include: {
            category: true,
            fields: true,
         },
         orderBy,
         skip,
         take: pageSize,
      } satisfies CatalogEntryFindManyArgs;

      const countArgs = {
         where,
      } satisfies CatalogEntryCountArgs;

      const [entries, totalElements] = await Promise.all([
         this.prisma.catalogEntry.findMany(findManyArgs) as Promise<
            CatalogEntryWithRelations[]
         >,
         this.prisma.catalogEntry.count(countArgs),
      ]);

      const content = toDCatalogEntrySummaries(entries);

      return {
         content,
         pageNumber,
         pageSize,
         numberOfElements: entries.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements,
      };
   }

   async pGetPublishedEntryBySlug(slug: string): Promise<DCatalogEntry | null> {
      const entry = await this.prisma.catalogEntry.findFirst({
         where: {
            slug,
            status: "PUBLISHED",
         },
         include: {
            category: true,
            fields: true,
         },
      });

      return entry ? toDCatalogEntry(entry as CatalogEntryWithRelations) : null;
   }

   async pGetPublishedEntryById(id: string): Promise<DCatalogEntry | null> {
      const entry = await this.prisma.catalogEntry.findFirst({
         where: { id, status: "PUBLISHED" },
         include: {
            category: true,
            fields: true,
         },
      });

      return entry ? toDCatalogEntry(entry as CatalogEntryWithRelations) : null;
   }

   async pGetCatalogEntryCategories(): Promise<DCatalogEntryCategory[]> {
      const categories = await this.prisma.catalogCategory.findMany({
         orderBy: { order: "asc" },
      });
      return map(categories, toDCatalogCategory);
   }

   async pIncrementCopyCount(catalogEntryId: string): Promise<void> {
      await this.prisma.catalogEntry.update({
         where: { id: catalogEntryId },
         data: { copyCount: { increment: 1 } },
      });
   }
}
