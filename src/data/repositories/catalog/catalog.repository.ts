import { map } from "es-toolkit/compat";

import {
   CatalogEntryWithContent,
   CatalogEntryWithRelations,
} from "@/data/types/db/catalog";
import { DbClient } from "@/data/types/db/common";
import {
   DCatalogEntriesPage,
   DCatalogEntriesPageQuery,
   DCatalogEntryCategory,
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";
import {
   CatalogCategoryFindManyArgs,
   CatalogEntryCountArgs,
   CatalogEntryFindFirstArgs,
   CatalogEntryFindManyArgs,
   CatalogEntryUpdateArgs,
} from "@/generated/prisma/models";

import {
   toDCatalogCategories,
   toDCatalogCategory,
   toDCatalogEntries,
   toDCatalogEntryWithContent,
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

      const content = toDCatalogEntries(entries);

      return {
         content,
         pageNumber,
         pageSize,
         numberOfElements: entries.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements,
      };
   }

   async pGetPublishedEntryById(
      id: string
   ): Promise<DCatalogEntryWithContent | null> {
      const args = {
         where: {
            id,
            status: "PUBLISHED",
         },
         include: {
            category: true,
            fields: true,
            content: true,
         },
      } satisfies CatalogEntryFindFirstArgs;

      const entry = (await this.prisma.catalogEntry.findFirst(
         args
      )) as CatalogEntryWithContent;

      if (entry) {
         return toDCatalogEntryWithContent(entry);
      }
      return null;
   }

   async pGetPublishedEntryBySlug(
      slug: string
   ): Promise<DCatalogEntryWithContent | null> {
      const args = {
         where: {
            slug,
            status: "PUBLISHED",
         },
         include: {
            category: true,
            fields: true,
            content: true,
         },
      } satisfies CatalogEntryFindFirstArgs;

      const entry = (await this.prisma.catalogEntry.findFirst(
         args
      )) as CatalogEntryWithContent;

      if (entry) {
         return toDCatalogEntryWithContent(entry);
      }
      return null;
   }

   async pGetCatalogEntryCategories(): Promise<DCatalogEntryCategory[]> {
      const args = {
         orderBy: { order: "asc" },
      } satisfies CatalogCategoryFindManyArgs;

      const categories = await this.prisma.catalogCategory.findMany(args);

      return toDCatalogCategories(categories);
   }

   async pIncrementCopyCount(catalogEntryId: string): Promise<void> {
      const args = {
         where: { id: catalogEntryId },
         data: {
            copyCount: {
               increment: 1,
            },
         },
      } satisfies CatalogEntryUpdateArgs;

      await this.prisma.catalogEntry.update(args);
   }
}
