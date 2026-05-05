import { map } from "es-toolkit/compat";

import { CatalogRepository } from "@/data/repositories/catalog";
import { TemplateRepository } from "@/data/repositories/template";
import {
   DCatalogCategory,
   DCatalogEntriesPage,
   DCatalogEntriesPageQuery,
   DCatalogEntry,
} from "@/data/types/domain/catalog";
import {
   DPromptTemplateDescriptor,
   DPromptTemplateFieldUpdate,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

export class CatalogService {
   constructor(
      private catalogRepository: CatalogRepository,
      private templateRepository: TemplateRepository
   ) {}

   async getPublishedCatalogEntriesPage(
      query?: DCatalogEntriesPageQuery
   ): Promise<DCatalogEntriesPage> {
      return await this.catalogRepository.pGetPublishedEntriesPage(query);
   }

   async getPublishedCatalogEntryBySlug(
      slug: string
   ): Promise<DCatalogEntry | null> {
      return await this.catalogRepository.pGetPublishedEntryBySlug(slug);
   }

   async getCategories(): Promise<DCatalogCategory[]> {
      return await this.catalogRepository.pGetCategories();
   }

   async copyEntryToUserTemplates(
      catalogEntryId: string,
      userId: string
   ): Promise<DPromptTemplateDescriptor> {
      const entry =
         await this.catalogRepository.pGetPublishedEntryById(catalogEntryId);

      if (!entry) {
         throw new Error(
            `CatalogEntry with ID ${catalogEntryId} not found or not published`
         );
      }

      const fields: DPromptTemplateFieldUpdate[] = map(entry.fields, (f) => ({
         name: f.name,
         label: f.label,
         description: f.description ?? undefined,
         type: f.type,
         required: f.required,
         order: f.order,
         defaultValue: f.defaultValue ?? undefined,
         options: f.options,
      }));

      const templateData: DPromptTemplateUpdate = {
         title: entry.title,
         description: entry.description,
         content: entry.content,
         recommendedModel: entry.recommendedModel,
         categories: entry.category ? [entry.category.name] : [],
         fields,
         globalFieldIds: [],
      };

      const newDescriptor =
         await this.templateRepository.pCreatePromptTemplateDescriptor(
            userId,
            templateData
         );

      // fire & forget — do not await
      this.catalogRepository
         .pIncrementCopyCount(catalogEntryId)
         .catch((err) => console.error("Failed to increment copy count:", err));

      return newDescriptor;
   }
}
