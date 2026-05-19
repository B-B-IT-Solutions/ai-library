import { CatalogRepository } from "@/data/repositories/catalog";
import { DPrompt, DPromptUpdateCrate } from "@/data/types/domain/prompt";
import { PromptService } from "../prompt";

import { toPromptUpdate } from "./catalog.mapper";

export class CatalogService {
   constructor(
      private readonly catalogRepository: CatalogRepository,
      private readonly promptService: PromptService
   ) {}

   async addCatalogEntryToUserPrompts(
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

      const data = toPromptUpdate(entry);
      const crate: DPromptUpdateCrate = {
         data,
      };

      const newDescriptor = await this.promptService.createPrompt(
         userId,
         crate
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
