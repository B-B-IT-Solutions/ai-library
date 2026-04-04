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
   LibraryCollectionFindManyArgs,
   LibraryCollectionUpdateArgs,
   LibraryCollectionUpdateInput,
} from "@/generated/prisma/models";

import {
   toDLibraryCollection,
   toDLibraryCollections,
} from "./collection.mapper";

export class CollectionRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetCollections(userId: string): Promise<DLibraryCollection[]> {
      const args: LibraryCollectionFindManyArgs = {
         where: { userId },
         orderBy: { order: "asc" },
         include: { _count: { select: { entries: true } } },
      };

      const collections = await this.prisma.libraryCollection.findMany(args);
      return toDLibraryCollections(
         collections as Parameters<typeof toDLibraryCollections>[0]
      );
   }

   async pGetCollectionById(
      userId: string,
      collectionId: string
   ): Promise<DLibraryCollection | null> {
      const collection = await this.prisma.libraryCollection.findUnique({
         where: { id: collectionId, userId },
         include: { _count: { select: { entries: true } } },
      });
      if (!collection) return null;
      return toDLibraryCollection(
         collection as Parameters<typeof toDLibraryCollection>[0]
      );
   }

   async pGetCollectionByShareToken(
      shareToken: string
   ): Promise<DLibraryCollection | null> {
      const collection = await this.prisma.libraryCollection.findUnique({
         where: { shareToken, isPublic: true },
         include: { _count: { select: { entries: true } } },
      });
      if (!collection) return null;
      return toDLibraryCollection(
         collection as Parameters<typeof toDLibraryCollection>[0]
      );
   }

   async pSetShareToken(
      userId: string,
      collectionId: string,
      shareToken: string | null,
      isPublic: boolean
   ): Promise<DLibraryCollection> {
      const collection = await this.prisma.libraryCollection.update({
         where: { id: collectionId, userId },
         data: { shareToken, isPublic },
         include: { _count: { select: { entries: true } } },
      });
      return toDLibraryCollection(
         collection as Parameters<typeof toDLibraryCollection>[0]
      );
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
   ): Promise<DLibraryCollection> {
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

      const collection = await this.prisma.libraryCollection.update(args);
      return toDLibraryCollection(collection);
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

   async pGetPublicCollectionTemplates(collectionId: string): Promise<
      {
         id: string;
         title: string;
         description: string;
         recommendedModel: string;
         categories: { name: string }[];
         createdAt: Date;
         updatedAt: Date;
      }[]
   > {
      const entries = await this.prisma.libraryCollectionEntry.findMany({
         where: { collectionId },
         include: {
            templateDescriptor: {
               include: { categories: true },
            },
         },
         orderBy: { addedAt: "asc" },
      });

      return entries.map((e) => e.templateDescriptor);
   }

   async pGetCollectionTemplateIds(
      userId: string,
      collectionId: string
   ): Promise<string[]> {
      const entries = await this.prisma.libraryCollectionEntry.findMany({
         where: {
            collectionId,
            collection: { userId },
         },
         select: { templateDescriptorId: true },
      });
      return entries.map((e) => e.templateDescriptorId);
   }

   async pAddTemplateToCollection(
      collectionId: string,
      templateDescriptorId: string
   ): Promise<void> {
      await this.prisma.libraryCollectionEntry.upsert({
         where: {
            collectionId_templateDescriptorId: {
               collectionId,
               templateDescriptorId,
            },
         },
         create: { collectionId, templateDescriptorId },
         update: {},
      });
   }

   async pRemoveTemplateFromCollection(
      collectionId: string,
      templateDescriptorId: string
   ): Promise<void> {
      await this.prisma.libraryCollectionEntry.deleteMany({
         where: { collectionId, templateDescriptorId },
      });
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
