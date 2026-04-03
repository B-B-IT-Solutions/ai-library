import { map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   DLibraryCollection,
   DLibraryCollectionUpdate,
} from "@/data/types/domain/library";
import {
   LibraryCollectionCreateArgs,
   LibraryCollectionCreateInput,
   LibraryCollectionDeleteArgs,
   LibraryCollectionUpdateArgs,
   LibraryCollectionUpdateInput,
} from "@/generated/prisma/models";

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

      const args: LibraryCollectionCreateArgs = {
         data: input,
      };

      const collection = await this.prisma.libraryCollection.create(args);

      return toDLibraryCollection(collection);
   }

   async pUpdateCollection(
      userId: string,
      collectionId: string,
      data: DLibraryCollectionUpdate
   ) {
      const input: LibraryCollectionUpdateInput = {
         name: data.name,
         description: data.description,
         color: data.color,
         order: data.order,
      };

      const args: LibraryCollectionUpdateArgs = {
         where: {
            id: collectionId,
            userId,
         },
         data: input,
      };

      await this.prisma.libraryCollection.update(args);
   }

   async pDeleteCollection(userId: string, collectionId: string) {
      const args: LibraryCollectionDeleteArgs = {
         where: {
            id: collectionId,
            userId,
         },
      };

      await this.prisma.libraryCollection.delete(args);
   }

   async pGetEntryCollectionIds(
      userId: string,
      descriptorId: string
   ): Promise<string[]> {
      const collectionEntries =
         await this.prisma.libraryCollectionEntry.findMany({
            where: { templateDescriptorId: descriptorId },
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
         where: { templateDescriptorId: descriptorId },
      });

      await this.prisma.libraryCollectionEntry.createMany({
         data: map(collectionIds, (collectionId) => ({
            templateDescriptorId: descriptorId,
            collectionId,
         })),
      });
   }
}
