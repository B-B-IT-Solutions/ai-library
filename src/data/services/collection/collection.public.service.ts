import { PublicCollectionRepository } from "@/data/repositories/collection";
import { DCollection } from "@/data/types/domain/collection";

export class PublicCollectionService {
   private collectionRepository: PublicCollectionRepository;

   constructor(collectionRepository: PublicCollectionRepository) {
      this.collectionRepository = collectionRepository;
   }

   async getCollectionByPublicToken(
      publicToken: string
   ): Promise<DCollection | null> {
      return await this.collectionRepository.pGetCollectionByPublicToken(
         publicToken
      );
   }

   async ensureCollectionsPublic(collectionIds: string[]): Promise<boolean> {
      return true;
   }
}
