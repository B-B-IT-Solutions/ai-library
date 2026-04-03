import { isEmpty, map } from "es-toolkit/compat";

import { LibraryRepository } from "@/data/repositories/library";
import { PromptTemplateService } from "@/data/services/prompt-template";
import { OrderProducts } from "@/data/types/db/order";
import {
   DLibraryCollection,
   DLibraryCollectionUpdate,
} from "@/data/types/domain/library";

export class LibraryService {
   private libraryRepository: LibraryRepository;
   private promptTemplateService: PromptTemplateService;

   constructor(
      libraryRepository: LibraryRepository,
      promptTemplateService: PromptTemplateService
   ) {
      this.libraryRepository = libraryRepository;
      this.promptTemplateService = promptTemplateService;
   }

   async createLibraryEntries(order: OrderProducts): Promise<void> {
      for (const item of order.items) {
         const { product } = item;
         const { productItems } = product;
         const templateIds = map(productItems, (i) => i.templateId);

         if (!isEmpty(templateIds)) {
            // await this.libraryRepository.pCreateLibraryEntries(
            //    order.userId,
            //    templateIds
            // );
         }
      }
   }

   async toggleFavorite(
      descriptorId: string,
      userId: string,
      isFavorite: boolean
   ) {
      await this.promptTemplateService.toggleFavorite(
         userId,
         descriptorId,
         isFavorite
      );
   }

   async getCollections(userId: string): Promise<DLibraryCollection[]> {
      return await this.libraryRepository.pGetCollections(userId);
   }

   async createCollection(
      userId: string,
      data: DLibraryCollectionUpdate
   ): Promise<DLibraryCollection> {
      return await this.libraryRepository.pCreateCollection(userId, data);
   }

   async updateCollection(
      collectionId: string,
      userId: string,
      data: DLibraryCollectionUpdate
   ) {
      await this.libraryRepository.pUpdateCollection(
         collectionId,
         userId,
         data
      );
   }

   async deleteCollection(collectionId: string, userId: string): Promise<void> {
      await this.libraryRepository.pDeleteCollection(collectionId, userId);
   }

   async getEntryCollectionIds(
      userId: string,
      entryId: string
   ): Promise<string[]> {
      return await this.libraryRepository.pGetEntryCollectionIds(
         userId,
         entryId
      );
   }

   async updateEntryCollections(
      userId: string,
      entryId: string,
      collectionIds: string[]
   ): Promise<void> {
      await this.libraryRepository.pUpdateEntryCollections(
         userId,
         entryId,
         collectionIds
      );
   }
}
