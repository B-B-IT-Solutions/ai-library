import { v4 as uuidv4 } from "uuid";

import { CollectionRepository } from "@/data/repositories/collection";
import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";

export class CollectionService {
   private collectionRepository: CollectionRepository;

   constructor(collectionRepository: CollectionRepository) {
      this.collectionRepository = collectionRepository;
   }

   async getCollections(userId: string): Promise<DCollection[]> {
      return await this.collectionRepository.pGetCollections(userId);
   }

   async getCollectionById(
      userId: string,
      collectionId: string
   ): Promise<DCollection | null> {
      return await this.collectionRepository.pGetCollectionById(
         userId,
         collectionId
      );
   }

   async createCollection(
      userId: string,
      data: DCollectionUpdate
   ): Promise<DCollection> {
      return await this.collectionRepository.pCreateCollection(userId, data);
   }

   async updateCollection(
      userId: string,
      collectionId: string,
      data: DCollectionUpdate
   ) {
      return await this.collectionRepository.pUpdateCollection(
         userId,
         collectionId,
         data
      );
   }

   async deleteCollection(userId: string, collectionId: string): Promise<void> {
      await this.collectionRepository.pDeleteCollection(userId, collectionId);
   }

   async getCollectionPromptIds(
      userId: string,
      collectionId: string
   ): Promise<string[]> {
      return await this.collectionRepository.pGetCollectionTemplateIds(
         userId,
         collectionId
      );
   }

   async addPromptToCollection(
      userId: string,
      collectionId: string,
      promptId: string
   ): Promise<void> {
      const collection = await this.getCollectionById(userId, collectionId);
      if (!collection) {
         throw new Error("Collection not found.");
      }

      await this.collectionRepository.pAddTemplateToCollection(
         userId,
         collectionId,
         promptId
      );
   }

   async removePromptFromCollection(
      userId: string,
      collectionId: string,
      promptId: string
   ): Promise<void> {
      const collection = await this.getCollectionById(userId, collectionId);
      if (!collection) {
         throw new Error("Collection not found.");
      }

      await this.collectionRepository.pRemoveTemplateFromCollection(
         userId,
         collectionId,
         promptId
      );
   }

   async setCollectionPublic(
      userId: string,
      collectionId: string,
      isPublic: boolean
   ): Promise<DCollection> {
      const token = isPublic ? uuidv4() : null;

      return await this.collectionRepository.pSetCollectionPublicToken(
         userId,
         collectionId,
         token,
         isPublic
      );
   }

   async getTemplateCollectionIds(
      userId: string,
      entryId: string
   ): Promise<string[]> {
      return await this.collectionRepository.pGetTemplateCollectionIds(
         userId,
         entryId
      );
   }

   async updateTemplateCollections(
      userId: string,
      entryId: string,
      collectionIds: string[]
   ): Promise<void> {
      await this.collectionRepository.pUpdateTemplateCollections(
         userId,
         entryId,
         collectionIds
      );
   }
}
