import { isEmpty, map } from "es-toolkit/compat";

import {
   GetLibraryEntryParams,
   LibraryRepository,
} from "@/data/repositories/library";
import { PromptTemplateService } from "@/data/services/prompt-template";
import { OrderProducts } from "@/data/types/db/order";
import {
   CreateCollectionInput,
   DLibraryCollection,
   DLibraryEntriesPage,
   DLibraryEntriesPageQuery,
   DLibraryEntry,
   DLibraryEntryWithPromptTemplate,
   UpdateCollectionInput,
} from "@/data/types/domain/library";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateFieldValues,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

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

   async getLibraryEntries(userId: string): Promise<DLibraryEntry[]> {
      return await this.libraryRepository.pGetLibraryEntries(userId);
   }

   async getLibraryEntry(
      entryId: string,
      userId: string
   ): Promise<DLibraryEntryWithPromptTemplate | null> {
      const params: GetLibraryEntryParams = {
         entryId,
         userId,
      };
      return await this.libraryRepository.pGetLibraryEntry(params);
   }

   async createLibraryEntry(data: DPromptTemplateUpdate, userId: string) {
      const ptd =
         await this.promptTemplateService.createPromptTemplateDescriptor(data);

      await this.libraryRepository.pCreateLibraryEntry(userId, ptd.id);
   }

   async createLibraryEntries(order: OrderProducts): Promise<void> {
      for (const item of order.items) {
         const { product } = item;
         const { productItems } = product;
         const templateIds = map(productItems, (i) => i.templateId);

         if (!isEmpty(templateIds)) {
            await this.libraryRepository.pCreateLibraryEntries(
               order.userId,
               templateIds
            );
         }
      }
   }

   async deleteLibraryEntries(userId: string) {
      await this.libraryRepository.pDeleteLibraryEntries(userId);
   }

   async composePromptFromTemplate(
      templateDescriptorId: string,
      fieldValues: DPromptTemplateFieldValues,
      userId: string
   ): Promise<DPromptUpdate> {
      const params: GetLibraryEntryParams = {
         templateDescriptorId,
         userId,
      };
      const entry = await this.libraryRepository.pGetLibraryEntry(params);

      if (!entry) {
         throw new Error("Template not found");
      }

      return await this.promptTemplateService.composePromptFromTemplate(
         entry.templateDescriptorId,
         fieldValues
      );
   }

   async downloadPromptTemplate(
      templateDescriptorId: string,
      userId: string
   ): Promise<string> {
      const params: GetLibraryEntryParams = {
         templateDescriptorId,
         userId,
      };
      const entry = await this.libraryRepository.pGetLibraryEntry(params);

      if (!entry) {
         throw new Error("Template not found");
      }

      const { templateDescriptor: descriptor } = entry;
      const downloadData = JSON.stringify(
         {
            title: descriptor.title,
            content: descriptor.promptTemplate.content,
            categories: descriptor.categories.map((c) => c.name),
            recommendedModel: descriptor.recommendedModel,
         },
         null,
         2
      );

      return downloadData;
   }

   // ==================== Filtering & Pagination ====================

   async getLibraryEntriesPage(
      userId: string,
      query?: DLibraryEntriesPageQuery
   ): Promise<DLibraryEntriesPage> {
      return await this.libraryRepository.pGetLibraryEntriesPage(userId, query);
   }

   async getLibraryCategories(userId: string): Promise<string[]> {
      return await this.libraryRepository.pGetLibraryCategories(userId);
   }

   async getLibraryModels(userId: string): Promise<string[]> {
      return await this.libraryRepository.pGetLibraryModels(userId);
   }

   // ==================== Favorites ====================

   async toggleFavorite(
      entryId: string,
      userId: string,
      isFavorite: boolean
   ): Promise<void> {
      await this.libraryRepository.pToggleFavorite(entryId, userId, isFavorite);
   }

   // ==================== Collections CRUD ====================

   async getCollections(userId: string): Promise<DLibraryCollection[]> {
      return await this.libraryRepository.pGetCollections(userId);
   }

   async createCollection(
      userId: string,
      data: CreateCollectionInput
   ): Promise<DLibraryCollection> {
      return await this.libraryRepository.pCreateCollection(userId, data);
   }

   async updateCollection(
      collectionId: string,
      userId: string,
      data: UpdateCollectionInput
   ): Promise<void> {
      await this.libraryRepository.pUpdateCollection(
         collectionId,
         userId,
         data
      );
   }

   async deleteCollection(collectionId: string, userId: string): Promise<void> {
      await this.libraryRepository.pDeleteCollection(collectionId, userId);
   }

   // ==================== Collection Entries ====================

   async addToCollection(collectionId: string, entryId: string): Promise<void> {
      await this.libraryRepository.pAddToCollection(collectionId, entryId);
   }

   async removeFromCollection(
      collectionId: string,
      entryId: string
   ): Promise<void> {
      await this.libraryRepository.pRemoveFromCollection(collectionId, entryId);
   }

   async getCollectionEntries(collectionId: string): Promise<DLibraryEntry[]> {
      return await this.libraryRepository.pGetCollectionEntries(collectionId);
   }
}
