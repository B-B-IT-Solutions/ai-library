import { map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   DCollection,
   DCollectionPreview,
   DCollectionsPage,
   DCollectionsPageQuery,
   DCollectionUpdate,
} from "@/data/types/domain/collection";
import {
   LibraryCollectionCountArgs,
   LibraryCollectionCreateArgs,
   LibraryCollectionCreateInput,
   LibraryCollectionDeleteArgs,
   LibraryCollectionEntryCreateManyArgs,
   LibraryCollectionEntryCreateManyInput,
   LibraryCollectionEntryDeleteManyArgs,
   LibraryCollectionEntryFindManyArgs,
   LibraryCollectionEntryUpsertArgs,
   LibraryCollectionFindManyArgs,
   LibraryCollectionFindUniqueArgs,
   LibraryCollectionUpdateArgs,
   LibraryCollectionUpdateInput,
} from "@/generated/prisma/models";

import {
   toDCollection,
   toDCollectionPreivew,
   toDCollectionPreviews,
   toDCollections,
} from "./collection.mapper";
import { resolveOrderBy, resolveWhereInput } from "./utils";

export class CollectionRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetCollectionsPage(
      userId: string,
      query?: DCollectionsPageQuery
   ): Promise<DCollectionsPage> {
      const pagination = query?.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const where = resolveWhereInput(userId, query?.filter);
      const orderBy = resolveOrderBy(query?.sort);

      const args: LibraryCollectionFindManyArgs = {
         where,
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
         orderBy,
         skip,
         take: pageSize,
      };

      const countArgs: LibraryCollectionCountArgs = { where };

      const [collections, totalElements] = await Promise.all([
         this.prisma.libraryCollection.findMany(args),
         this.prisma.libraryCollection.count(countArgs),
      ]);

      return {
         content: toDCollections(collections),
         pageNumber,
         pageSize,
         numberOfElements: collections.length,
         totalPages: Math.ceil(totalElements / pageSize),
         totalElements,
      };
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

   async pGetCollectionPreviews(userId: string): Promise<DCollectionPreview[]> {
      const args = {
         where: {
            userId,
         },
         orderBy: {
            order: "asc",
         },
         select: {
            id: true,
            name: true,
            color: true,
         },
      } satisfies LibraryCollectionFindManyArgs;

      const collections = await this.prisma.libraryCollection.findMany(args);
      return toDCollectionPreviews(collections);
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

   async pGetCollectionPreviewById(
      userId: string,
      collectionId: string
   ): Promise<DCollectionPreview | null> {
      const args = {
         where: {
            id: collectionId,
            userId,
         },
         select: {
            id: true,
            name: true,
            color: true,
         },
      } satisfies LibraryCollectionFindUniqueArgs;

      const collection = await this.prisma.libraryCollection.findUnique(args);

      if (!collection) {
         return null;
      }
      return toDCollectionPreivew(collection);
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

   async pGetCollectionPromptIds(
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
            promptId: true,
         },
      } satisfies LibraryCollectionEntryFindManyArgs;

      const entries = await this.prisma.libraryCollectionEntry.findMany(args);
      return map(entries, (e) => e.promptId);
   }

   async pAddPromptToCollection(
      userId: string,
      collectionId: string,
      promptId: string
   ): Promise<void> {
      const args = {
         where: {
            collection: {
               userId,
            },
            collectionId_promptId: {
               collectionId,
               promptId,
            },
         },
         create: {
            collectionId,
            promptId,
            userId,
         },
         update: {},
      } satisfies LibraryCollectionEntryUpsertArgs;

      await this.prisma.libraryCollectionEntry.upsert(args);
   }

   async pRemovePromptFromCollection(
      userId: string,
      collectionId: string,
      promptId: string
   ): Promise<void> {
      const args = {
         where: {
            collection: {
               userId,
            },
            collectionId,
            promptId,
         },
      } satisfies LibraryCollectionEntryDeleteManyArgs;

      await this.prisma.libraryCollectionEntry.deleteMany(args);
   }

   async pGetPromptCollectionIds(
      userId: string,
      promptId: string
   ): Promise<string[]> {
      const args = {
         where: {
            userId,
            promptId,
         },
         select: { collectionId: true },
      } satisfies LibraryCollectionEntryFindManyArgs;

      const collectionEntries =
         await this.prisma.libraryCollectionEntry.findMany(args);

      return map(collectionEntries, (ce) => ce.collectionId);
   }

   async pUpdatePromptCollections(
      userId: string,
      promptId: string,
      collectionIds: string[]
   ): Promise<void> {
      const deleteArgs = {
         where: {
            userId,
            promptId,
         },
      } satisfies LibraryCollectionEntryDeleteManyArgs;

      await this.prisma.libraryCollectionEntry.deleteMany(deleteArgs);

      const createInputs: LibraryCollectionEntryCreateManyInput[] = map(
         collectionIds,
         (collectionId) => {
            return {
               promptId,
               collectionId,
               userId,
            };
         }
      );

      const createArgs = {
         data: createInputs,
      } satisfies LibraryCollectionEntryCreateManyArgs;

      await this.prisma.libraryCollectionEntry.createMany(createArgs);
   }
}
