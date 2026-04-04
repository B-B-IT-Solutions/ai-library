import { isEmpty, map } from "es-toolkit/compat";

import { CollectionRepository } from "@/data/repositories/collection";
import { OrderProducts } from "@/data/types/db/order";
import {
   DLibraryCollection,
   DLibraryCollectionUpdate,
} from "@/data/types/domain/collection";

export class CollectionService {
   private libraryRepository: CollectionRepository;

   constructor(libraryRepository: CollectionRepository) {
      this.libraryRepository = libraryRepository;
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
         userId,
         collectionId,
         data
      );
   }

   async deleteCollection(collectionId: string, userId: string): Promise<void> {
      await this.libraryRepository.pDeleteCollection(userId, collectionId);
   }

   async getCollectionById(
      userId: string,
      collectionId: string
   ): Promise<DLibraryCollection | null> {
      return await this.libraryRepository.pGetCollectionById(
         userId,
         collectionId
      );
   }

   async getCollectionByShareToken(
      shareToken: string
   ): Promise<DLibraryCollection | null> {
      return await this.libraryRepository.pGetCollectionByShareToken(
         shareToken
      );
   }

   async getPublicCollectionTemplates(collectionId: string) {
      return await this.libraryRepository.pGetPublicCollectionTemplates(
         collectionId
      );
   }

   async getCollectionTemplateIds(
      userId: string,
      collectionId: string
   ): Promise<string[]> {
      return await this.libraryRepository.pGetCollectionTemplateIds(
         userId,
         collectionId
      );
   }

   async addTemplateToCollection(
      collectionId: string,
      templateDescriptorId: string
   ): Promise<void> {
      await this.libraryRepository.pAddTemplateToCollection(
         collectionId,
         templateDescriptorId
      );
   }

   async removeTemplateFromCollection(
      collectionId: string,
      templateDescriptorId: string
   ): Promise<void> {
      await this.libraryRepository.pRemoveTemplateFromCollection(
         collectionId,
         templateDescriptorId
      );
   }

   async setCollectionSharing(
      userId: string,
      collectionId: string,
      isPublic: boolean,
      shareToken: string | null
   ): Promise<DLibraryCollection> {
      return await this.libraryRepository.pSetShareToken(
         userId,
         collectionId,
         shareToken,
         isPublic
      );
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
