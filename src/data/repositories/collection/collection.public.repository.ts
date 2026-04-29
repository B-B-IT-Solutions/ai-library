import { DbClient } from "@/data/types/db/common";
import { DCollection } from "@/data/types/domain/collection";

import { toDCollection } from "./collection.mapper";

export class PublicCollectionRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetCollectionByPublicToken(
      publicToken: string
   ): Promise<DCollection | null> {
      const collection = await this.prisma.libraryCollection.findUnique({
         where: {
            publicToken,
            isPublic: true,
         },
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
      });

      if (!collection) {
         return null;
      }
      return toDCollection(collection);
   }
}
