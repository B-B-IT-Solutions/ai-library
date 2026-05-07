import { CatalogRepository } from "@/data/repositories/catalog";
import {
   DCatalogEntriesPage,
   DCatalogEntriesPageQuery,
   DCatalogEntryCategory,
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";

export class PublicCatalogService {
   constructor(private readonly catalogRepository: CatalogRepository) {}

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
}
