import { DbClient } from "@/data/types/db/common";
import { DCollection } from "@/data/types/domain/collection";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

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

   async pGetPublicCollectionTemplates(
      collectionId: string
   ): Promise<DPromptTemplateDescriptor[]> {
      const entries = await this.prisma.libraryCollectionEntry.findMany({
         where: { collectionId },
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: {
            addedAt: "asc",
         },
      });

      return entries.map((e) => e.templateDescriptor);
   }
}
