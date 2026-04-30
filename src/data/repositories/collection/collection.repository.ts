import { map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";
import {
   LibraryCollectionCreateArgs,
   LibraryCollectionCreateInput,
   LibraryCollectionDeleteArgs,
   LibraryCollectionEntryDeleteManyArgs,
   LibraryCollectionEntryFindManyArgs,
   LibraryCollectionEntryUpsertArgs,
   LibraryCollectionFindManyArgs,
   LibraryCollectionFindUniqueArgs,
   LibraryCollectionUpdateArgs,
   LibraryCollectionUpdateInput,
} from "@/generated/prisma/models";

import { toDCollection, toDCollections } from "./collection.mapper";

export class CollectionRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetCollections(userId: string): Promise<DCollection[]> {
      const args = {
         where: {
            userId,
         },
         orderBy: {
            order: "asc",
         },
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
      } satisfies LibraryCollectionFindManyArgs;

      const collections = await this.prisma.libraryCollection.findMany(args);
      return toDCollections(collections);
   }

   async pGetCollectionById(
      userId: string,
      collectionId: string
   ): Promise<DCollection | null> {
      const args = {
         where: {
            id: collectionId,
            userId,
         },
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
      } satisfies LibraryCollectionFindUniqueArgs;

      const collection = await this.prisma.libraryCollection.findUnique(args);

      if (!collection) {
         return null;
      }
      return toDCollection(collection);
   }

   async pCreateCollection(
      userId: string,
      data: DCollectionUpdate
   ): Promise<DCollection> {
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

      const args = {
         data: input,
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
      } satisfies LibraryCollectionCreateArgs;

      const collection = await this.prisma.libraryCollection.create(args);
      return toDCollection(collection);
   }

   async pUpdateCollection(
      userId: string,
      collectionId: string,
      data: DCollectionUpdate
   ): Promise<DCollection> {
      const input: LibraryCollectionUpdateInput = {
         name: data.name,
         description: data.description,
         color: data.color,
         order: data.order,
      };

      const args = {
         where: {
            id: collectionId,
            userId,
         },
         data: input,
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
      } satisfies LibraryCollectionUpdateArgs;

      const collection = await this.prisma.libraryCollection.update(args);
      return toDCollection(collection);
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

   async pSetCollectionPublicToken(
      userId: string,
      collectionId: string,
      publicToken: string | null,
      isPublic: boolean
   ): Promise<DCollection> {
      const input: LibraryCollectionUpdateInput = {
         publicToken,
         isPublic,
      };

      const args = {
         where: {
            id: collectionId,
            userId,
         },
         data: input,
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
      } satisfies LibraryCollectionUpdateArgs;

      const collection = await this.prisma.libraryCollection.update(args);

      return toDCollection(collection);
   }

   async pGetCollectionTemplateIds(
      userId: string,
      collectionId: string
   ): Promise<string[]> {
      const args = {
         where: {
            collectionId,
            collection: {
               userId,
            },
         },
         select: {
            templateDescriptorId: true,
         },
      } satisfies LibraryCollectionEntryFindManyArgs;

      const entries = await this.prisma.libraryCollectionEntry.findMany(args);
      return map(entries, (e) => e.templateDescriptorId);
   }

   async pAddTemplateToCollection(
      userId: string,
      collectionId: string,
      templateDescriptorId: string
   ): Promise<void> {
      const args = {
         where: {
            collection: {
               userId,
            },
            collectionId_templateDescriptorId: {
               collectionId,
               templateDescriptorId,
            },
         },
         create: {
            collectionId,
            templateDescriptorId,
         },
         update: {},
      } satisfies LibraryCollectionEntryUpsertArgs;

      await this.prisma.libraryCollectionEntry.upsert(args);
   }

   async pRemoveTemplateFromCollection(
      userId: string,
      collectionId: string,
      templateDescriptorId: string
   ): Promise<void> {
      const args = {
         where: {
            collection: {
               userId,
            },
            collectionId,
            templateDescriptorId,
         },
      } satisfies LibraryCollectionEntryDeleteManyArgs;

      await this.prisma.libraryCollectionEntry.deleteMany(args);
   }

   async pGetTemplateCollectionIds(
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

   async pUpdateTemplateCollections(
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
