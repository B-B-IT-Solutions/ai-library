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

   async getCollectionByShareToken(
      shareToken: string
   ): Promise<DCollection | null> {
      return await this.libraryRepository.pGetCollectionByShareToken(
         shareToken
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

   async deleteCollection(collectionId: string, userId: string): Promise<void> {
      await this.libraryRepository.pDeleteCollection(userId, collectionId);
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
      userId: string,
      collectionId: string,
      templateDescriptorId: string
   ): Promise<void> {
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
      await this.libraryRepository.pRemoveTemplateFromCollection(
         userId,
         collectionId,
         templateDescriptorId
      );
   }

   async setCollectionSharing(
      userId: string,
      collectionId: string,
      isPublic: boolean,
      shareToken: string | null
   ): Promise<DCollection> {
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
