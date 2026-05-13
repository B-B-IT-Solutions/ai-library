import { CatalogRepository } from "@/data/repositories/catalog";
import { DPrompt } from "@/data/types/domain/prompt";
import { TemplateService } from "../prompt";

import { toPromptTemplateUpdate } from "./catalog.mapper";

export class CatalogService {
   constructor(
      private readonly catalogRepository: CatalogRepository,
      private readonly templateService: TemplateService
   ) {}

   async addCatalogEntryToUserTemplates(
      userId: string,
      catalogEntryId: string
   ): Promise<DPrompt> {
      const entry =
         await this.catalogRepository.pGetPublishedEntryById(catalogEntryId);

      if (!entry) {
         throw new Error(
            `CatalogEntry with ID ${catalogEntryId} not found or not published`
         );
      }

      const templateData = toPromptTemplateUpdate(entry);

      const newDescriptor = await this.templateService.createTemplateDescriptor(
         userId,
         templateData
      );

      // fire & forget — do not await
      this.incrementCatalogEntryCopyCount(entry.id);
      return newDescriptor;
   }

   async incrementCatalogEntryCopyCount(catalogEntryId: string) {
      try {
         await this.catalogRepository.pIncrementCopyCount(catalogEntryId);
      } catch (err) {
         console.error("Failed to increment copy count:", err);
      }
   }
}
