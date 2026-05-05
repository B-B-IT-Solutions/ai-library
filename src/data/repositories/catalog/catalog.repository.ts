import { map } from "es-toolkit/compat";

import { CatalogEntryWithRelations } from "@/data/types/db/catalog";
import { DbClient } from "@/data/types/db/common";
import {
   DCatalogEntriesPage,
   DCatalogEntriesPageQuery,
   DCatalogEntry,
   DCatalogEntryCategory,
   DCatalogEntrySummary,
} from "@/data/types/domain/catalog";

import {
   toDCatalogCategory,
   toDCatalogEntry,
   toDCatalogEntrySummary,
} from "./catalog.mapper";

export class CatalogRepository {
   constructor(private readonly prisma: DbClient) {}

   async pGetPublishedEntriesPage(
      query?: DCatalogEntriesPageQuery
   ): Promise<DCatalogEntriesPage> {
      const pagination = query?.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 12;
      const skip = pageNumber * pageSize;

      const sort = query?.sort ?? "newest";
      const filter = query?.filter;

      const where = this.resolveWhereInput(filter);
      const orderBy = this.resolveOrderBy(sort);

      const [entries, totalElements] = await Promise.all([
         this.prisma.catalogEntry.findMany({
            where,
            include: {
               category: true,
               fields: true,
            },
            orderBy,
            skip,
            take: pageSize,
         }) as Promise<CatalogEntryWithRelations[]>,
         this.prisma.catalogEntry.count({ where }),
      ]);

      const content: DCatalogEntrySummary[] = map(
         entries,
         toDCatalogEntrySummary
      );

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
         where: { slug, status: "PUBLISHED" },
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

   private resolveWhereInput(filter?: DCatalogEntriesPageQuery["filter"]) {
      const base = { status: "PUBLISHED" as const };

      if (!filter) return base;

      const { search, categorySlug } = filter;

      return {
         ...base,
         ...(search
            ? {
                 OR: [
                    {
                       title: {
                          contains: search,
                          mode: "insensitive" as const,
                       },
                    },
                    {
                       description: {
                          contains: search,
                          mode: "insensitive" as const,
                       },
                    },
                 ],
              }
            : {}),
         ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      };
   }

   private resolveOrderBy(sort: "newest" | "popular") {
      if (sort === "popular") {
         return { copyCount: "desc" as const };
      }
      return { publishedAt: "desc" as const };
   }
}
