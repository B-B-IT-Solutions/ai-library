import { map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   DLibraryCollection,
   DLibraryCollectionUpdate,
} from "@/data/types/domain/library";
import { LibraryCollectionCreateInput } from "@/generated/prisma/models";

import { toDLibraryCollection, toDLibraryCollections } from "./library.mapper";

export class LibraryRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetCollections(userId: string): Promise<DLibraryCollection[]> {
      const collections = await this.prisma.libraryCollection.findMany({
         where: { userId },
         orderBy: {
            order: "asc",
         },
      });

      return toDLibraryCollections(collections);
   }

   async pCreateCollection(
      userId: string,
      data: DLibraryCollectionUpdate
   ): Promise<DLibraryCollection> {
      const input: LibraryCollectionCreateInput = {
         user: {
            connect: {
               id: userId,
            },
         },
         name: data.name,
         description: data.description ?? null,
         color: data.color ?? null,
         order: data.order ?? 0,
      };

      const collection = await this.prisma.libraryCollection.create({
         data: input,
         include: {
            _count: {
               select: { entries: true },
            },
         },
      });

      return toDLibraryCollection(collection);
   }

   async pUpdateCollection(
      collectionId: string,
      userId: string,
      data: DLibraryCollectionUpdate
   ) {
      await this.prisma.libraryCollection.update({
         where: {
            id: collectionId,
            userId,
         },
         data: {
            name: data.name,
            description: data.description,
            color: data.color,
            order: data.order,
         },
      });
   }

   async pDeleteCollection(collectionId: string, userId: string) {
      await this.prisma.libraryCollection.delete({
         where: {
            id: collectionId,
            userId,
         },
      });
   }

   async pGetEntryCollectionIds(
      userId: string,
      descriptorId: string
   ): Promise<string[]> {
      const collectionEntries =
         await this.prisma.libraryCollectionEntry.findMany({
            where: { promptTemplateDescriptorId: descriptorId },
            select: { collectionId: true },
         });

      return map(collectionEntries, (ce) => ce.collectionId);
   }

   async pUpdateEntryCollections(
      userId: string,
      descriptorId: string,
      collectionIds: string[]
   ): Promise<void> {
      await this.prisma.libraryCollectionEntry.deleteMany({
         where: { promptTemplateDescriptorId: descriptorId },
      });

      await this.prisma.libraryCollectionEntry.createMany({
         data: map(collectionIds, (collectionId) => ({
            promptTemplateDescriptorId: descriptorId,
            collectionId,
         })),
      });
   }
}
