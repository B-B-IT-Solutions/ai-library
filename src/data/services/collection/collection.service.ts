import { v4 as uuidv4 } from "uuid";

import { CollectionRepository } from "@/data/repositories/collection";
import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";

export class CollectionService {
   private libraryRepository: CollectionRepository;

   constructor(libraryRepository: CollectionRepository) {
      this.libraryRepository = libraryRepository;
   }

   async getCollections(userId: string): Promise<DCollection[]> {
      return await this.libraryRepository.pGetCollections(userId);
   }

   async getCollectionById(
      userId: string,
      collectionId: string
   ): Promise<DCollection | null> {
      return await this.libraryRepository.pGetCollectionById(
         userId,
         collectionId
      );
   }

   async getCollectionByPublicToken(
      publicToken: string
   ): Promise<DCollection | null> {
      return await this.libraryRepository.pGetCollectionByPublicToken(
         publicToken
      );
   }

   async createCollection(
      userId: string,
      data: DCollectionUpdate
   ): Promise<DCollection> {
      return await this.libraryRepository.pCreateCollection(userId, data);
   }

   async updateCollection(
      userId: string,
      collectionId: string,
      data: DCollectionUpdate
   ) {
      return await this.libraryRepository.pUpdateCollection(
         userId,
         collectionId,
         data
      );
   }

   async deleteCollection(userId: string, collectionId: string): Promise<void> {
      await this.libraryRepository.pDeleteCollection(userId, collectionId);
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
      userId: string,
      collectionId: string,
      templateDescriptorId: string
   ): Promise<void> {
      const collection = await this.getCollectionById(userId, collectionId);
      if (!collection) {
         throw new Error("Collection not found.");
      }

      await this.libraryRepository.pAddTemplateToCollection(
         userId,
         collectionId,
         templateDescriptorId
      );
   }

   async removeTemplateFromCollection(
      userId: string,
      collectionId: string,
      templateDescriptorId: string
   ): Promise<void> {
      const collection = await this.getCollectionById(userId, collectionId);
      if (!collection) {
         throw new Error("Collection not found.");
      }

      await this.libraryRepository.pRemoveTemplateFromCollection(
         userId,
         collectionId,
         templateDescriptorId
      );
   }

   async setCollectionPublic(
      userId: string,
      collectionId: string,
      isPublic: boolean
   ): Promise<DCollection> {
      const token = isPublic ? uuidv4() : null;

      return await this.libraryRepository.pSetPublicToken(
         userId,
         collectionId,
         token,
         isPublic
      );
   }

   async getPublicCollectionTemplates(collectionId: string) {
      return await this.libraryRepository.pGetPublicCollectionTemplates(
         collectionId
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
