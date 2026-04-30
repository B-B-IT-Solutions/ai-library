import { isEmpty } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import { DCollection } from "@/data/types/domain/collection";
import { LibraryCollectionCountArgs } from "@/generated/prisma/models";

import { toDCollection } from "./collection.mapper";

export class PublicCollectionRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetPublicCollectionByToken(
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

   async pEnsureCollectionsPublic(collectionIds: string[]): Promise<boolean> {
      if (isEmpty(collectionIds)) {
         return false;
      }

      const args = {
         where: {
            id: { in: collectionIds },
            isPublic: true,
         },
      } satisfies LibraryCollectionCountArgs;

      const publicCount = await this.prisma.libraryCollection.count(args);

      return publicCount === collectionIds.length;
   }
}
