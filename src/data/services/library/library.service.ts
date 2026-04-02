import { isEmpty, map } from "es-toolkit/compat";

import {
   GetLibraryEntryParams,
   LibraryRepository,
} from "@/data/repositories/library";
import { PromptTemplateService } from "@/data/services/prompt-template";
import { OrderProducts } from "@/data/types/db/order";
import {
   DLibraryCollection,
   DLibraryCollectionUpdate,
} from "@/data/types/domain/library";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateFieldValues,
   DPromptTemplateUpdate,
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
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

   async getLibraryEntriesPage(
      userId: string,
      query?: DTemplateDescriptorsPageQuery
   ): Promise<DTemplateDescriptorsPage> {
      return await this.promptTemplateService.getTemplateDescriptorsPage(
         userId,
         query
      );
   }

   async getLibraryEntry(
      userId: string,
      descriptorId: string
   ): Promise<DPromptTemplateDescriptorWithTemplate | null> {
      return await this.promptTemplateService.getPromptTemplateDescriptorWithTemplate(
         userId,
         descriptorId
      );
   }

   async createLibraryEntry(
      data: DPromptTemplateUpdate,
      userId: string
   ): Promise<DPromptTemplateDescriptor> {
      return await this.promptTemplateService.createPromptTemplateDescriptor(
         userId,
         data
      );
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

   async updateLibraryEntry(
      userId: string,
      descriptorId: string,
      data: DPromptTemplateUpdate
   ) {
      const descriptor = await this.getLibraryEntry(userId, descriptorId);
      if (!descriptor) {
         throw new Error("Library entry not found");
      }
      await this.promptTemplateService.updatePromptTemplateDescriptor(
         userId,
         descriptor.id,
         data
      );
   }

   async deleteLibraryEntry(userId: string, descriptorId: string) {
      const descriptor = await this.getLibraryEntry(userId, descriptorId);
      if (!descriptor) {
         throw new Error("Library entry not found");
      }
      await this.promptTemplateService.deletePromptTemplateDescriptor(
         userId,
         descriptor.id
      );
   }

   async deleteLibraryEntries(userId: string) {
      await this.libraryRepository.pDeleteLibraryEntries(userId);
   }

   async composePromptFromTemplate(
      descriptorId: string,
      fieldValues: DPromptTemplateFieldValues,
      userId: string
   ): Promise<DPromptUpdate> {
      const descriptor = await this.getLibraryEntry(userId, descriptorId);

      if (!descriptor) {
         throw new Error("Template not found");
      }

      return await this.promptTemplateService.composePromptFromTemplate(
         userId,
         descriptor.id,
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

   async getLibraryCategories(userId: string): Promise<string[]> {
      return await this.libraryRepository.pGetLibraryCategories(userId);
   }

   async getLibraryModels(userId: string): Promise<string[]> {
      return await this.libraryRepository.pGetLibraryModels(userId);
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
