import { PublicCatalogRepository } from "@/data/repositories/catalog";
import {
   DCatalogEntriesPage,
   DCatalogEntriesPageQuery,
   DCatalogEntryCategory,
   DCatalogEntrySitemapData,
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";

export class PublicCatalogService {
   constructor(private readonly catalogRepository: PublicCatalogRepository) {}

   async getPublishedCatalogEntriesPage(
      query?: DCatalogEntriesPageQuery
   ): Promise<DCatalogEntriesPage> {
      return await this.catalogRepository.pGetPublishedEntriesPage(query);
   }

   async getPublishedCatalogEntryBySlug(
      slug: string
   ): Promise<DCatalogEntryWithContent | null> {
      return await this.catalogRepository.pGetPublishedEntryBySlug(slug);
   }

   async getCatalogEntryCategories(): Promise<DCatalogEntryCategory[]> {
      return await this.catalogRepository.pGetCatalogEntryCategories();
   }

   async getPublishedCatalogEntriesSitemapData(): Promise<DCatalogEntrySitemapData[]> {
      return await this.catalogRepository.pGetPublishedEntriesSitemapData();
   }
}
