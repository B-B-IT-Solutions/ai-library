import { flatMap, map, uniq } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   LibraryCollectionWithCount,
   LibraryEntryWithCollections,
   LibraryEntryWithPromptTemplateDescriptor,
} from "@/data/types/db/library";
import {
   CreateCollectionInput,
   DLibraryCollection,
   DLibraryEntriesPage,
   DLibraryEntriesPageQuery,
   DLibraryEntry,
   DLibraryEntryWithPromptTemplate,
   UpdateCollectionInput,
} from "@/data/types/domain/library";
import {
   LibraryCollectionCreateInput,
   LibraryCollectionEntryCreateInput,
   LibraryEntryCreateArgs,
   LibraryEntryCreateInput,
   LibraryEntryCreateManyArgs,
   LibraryEntryCreateManyInput,
   LibraryEntryWhereInput,
   LibraryEntryWhereUniqueInput,
} from "@/generated/prisma/models";

import {
   toDLibraryCollection,
   toDLibraryCollections,
   toDLibraryEntries,
   toDLibraryEntry,
   toDLibraryEntryWithPromptTemplate,
} from "./library.mapper";

export type GetLibraryEntryParams = {
   userId: string;
} & (
   | { entryId: string; templateDescriptorId?: never }
   | { templateDescriptorId: string; entryId?: never }
);

export class LibraryRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetLibraryEntries(userId: string): Promise<DLibraryEntry[]> {
      const entries: LibraryEntryWithPromptTemplateDescriptor[] =
         await this.prisma.libraryEntry.findMany({
            where: { userId },
            include: {
               templateDescriptor: {
                  include: {
                     categories: true,
                  },
               },
            },
            orderBy: {
               createdAt: "desc",
            },
         });
      return toDLibraryEntries(entries);
   }

   async pGetLibraryEntry(
      params: GetLibraryEntryParams
   ): Promise<DLibraryEntryWithPromptTemplate | null> {
      const where = this.getLibraryEntryParamsToWhereFindUniqueInput(params);
      const entry = await this.prisma.libraryEntry.findUnique({
         where: where,
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
                  promptTemplate: {
                     include: {
                        fields: true,
                     },
                  },
               },
            },
         },
      });

      if (entry) {
         return toDLibraryEntryWithPromptTemplate(entry);
      }
      return null;
   }

   async pCreateLibraryEntry(userId: string, templateDescriptorId: string) {
      const input: LibraryEntryCreateInput = {
         templateDescriptor: {
            connect: {
               id: templateDescriptorId,
            },
         },
         user: {
            connect: {
               id: userId,
            },
         },
      };
      const args: LibraryEntryCreateArgs = {
         data: input,
      };

      return await this.prisma.libraryEntry.create(args);
   }

   async pCreateLibraryEntries(
      userId: string,
      templateDescriptorIds: string[]
   ) {
      const entries = map(templateDescriptorIds, (templateDescriptorId) => {
         const entry: LibraryEntryCreateManyInput = {
            userId,
            templateDescriptorId,
         };
         return entry;
      });

      const args: LibraryEntryCreateManyArgs = {
         data: entries,
         skipDuplicates: true,
      };

      await this.prisma.libraryEntry.createMany(args);
   }

   async pDeleteLibraryEntries(userId: string) {
      return await this.prisma.libraryEntry.deleteMany({
         where: { userId },
      });
   }

   // ==================== Filtering & Pagination ====================

   async pGetLibraryEntriesPage(
      userId: string,
      query?: DLibraryEntriesPageQuery
   ): Promise<DLibraryEntriesPage> {
      const pageNumber = query?.pageNumber ?? 1;
      const pageSize = query?.pageSize ?? 20;
      const skip = (pageNumber - 1) * pageSize;

      const where = this.resolveWhereInput(userId, query?.filter);

      const [entries, totalEntries] = await Promise.all([
         this.prisma.libraryEntry.findMany({
            where,
            include: {
               templateDescriptor: {
                  include: {
                     categories: true,
                  },
               },
               collectionEntries: {
                  select: { collectionId: true },
               },
            },
            orderBy: this.resolveSortOrder(query?.filter),
            skip,
            take: pageSize,
         }) as Promise<LibraryEntryWithCollections[]>,
         this.prisma.libraryEntry.count({ where }),
      ]);

      return {
         content: map(entries, toDLibraryEntry),
         pageNumber,
         pageSize,
         totalPages: Math.ceil(totalEntries / pageSize),
         totalEntries,
      };
   }

   async pGetLibraryCategories(userId: string): Promise<string[]> {
      const entries = await this.prisma.libraryEntry.findMany({
         where: { userId },
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
      });

      const categories = flatMap(entries, (entry) =>
         map(entry.templateDescriptor.categories, (cat) => cat.name)
      );

      return uniq(categories).sort();
   }

   async pGetLibraryModels(userId: string): Promise<string[]> {
      const entries = await this.prisma.libraryEntry.findMany({
         where: { userId },
         include: {
            templateDescriptor: {
               select: {
                  recommendedModel: true,
               },
            },
         },
      });

      const models = map(
         entries,
         (entry) => entry.templateDescriptor.recommendedModel
      );
      return uniq(models).sort();
   }

   // ==================== Favorites ====================

   async pToggleFavorite(
      entryId: string,
      userId: string,
      isFavorite: boolean
   ): Promise<void> {
      await this.prisma.libraryEntry.update({
         where: {
            id: entryId,
            userId,
         },
         data: {
            isFavorite,
         },
      });
   }

   // ==================== Collections CRUD ====================

   async pGetCollections(userId: string): Promise<DLibraryCollection[]> {
      const collections: LibraryCollectionWithCount[] =
         await this.prisma.libraryCollection.findMany({
            where: { userId },
            include: {
               _count: {
                  select: { entries: true },
               },
            },
            orderBy: {
               order: "asc",
            },
         });

      return toDLibraryCollections(collections);
   }

   async pCreateCollection(
      userId: string,
      data: CreateCollectionInput
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
      data: UpdateCollectionInput
   ): Promise<void> {
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

   async pDeleteCollection(
      collectionId: string,
      userId: string
   ): Promise<void> {
      await this.prisma.libraryCollection.delete({
         where: {
            id: collectionId,
            userId,
         },
      });
   }

   // ==================== Collection Entries ====================

   async pAddToCollection(
      collectionId: string,
      entryId: string
   ): Promise<void> {
      const input: LibraryCollectionEntryCreateInput = {
         collection: {
            connect: {
               id: collectionId,
            },
         },
         entry: {
            connect: {
               id: entryId,
            },
         },
      };

      await this.prisma.libraryCollectionEntry.create({
         data: input,
      });
   }

   async pRemoveFromCollection(
      collectionId: string,
      entryId: string
   ): Promise<void> {
      await this.prisma.libraryCollectionEntry.delete({
         where: {
            collectionId_entryId: {
               collectionId,
               entryId,
            },
         },
      });
   }

   async pGetCollectionEntries(collectionId: string): Promise<DLibraryEntry[]> {
      const collectionEntries =
         await this.prisma.libraryCollectionEntry.findMany({
            where: { collectionId },
            include: {
               entry: {
                  include: {
                     templateDescriptor: {
                        include: {
                           categories: true,
                        },
                     },
                     collectionEntries: {
                        select: { collectionId: true },
                     },
                  },
               },
            },
            orderBy: {
               addedAt: "desc",
            },
         });

      return map(collectionEntries, (ce) =>
         toDLibraryEntry(ce.entry as LibraryEntryWithCollections)
      );
   }

   // ==================== Private Helpers ====================

   private resolveWhereInput(
      userId: string,
      filter?: DLibraryEntriesPageQuery["filter"]
   ): LibraryEntryWhereInput {
      const where: LibraryEntryWhereInput = { userId };

      if (!filter) return where;

      // Search
      if (filter.search) {
         where.templateDescriptor = {
            OR: [
               { title: { contains: filter.search, mode: "insensitive" } },
               {
                  description: { contains: filter.search, mode: "insensitive" },
               },
            ],
         };
      }

      // Categories
      if (filter.categories && filter.categories.length > 0) {
         where.templateDescriptor = {
            ...where.templateDescriptor,
            categories: {
               some: {
                  name: {
                     in: filter.categories,
                  },
               },
            },
         };
      }

      // Models
      if (filter.models && filter.models.length > 0) {
         where.templateDescriptor = {
            ...where.templateDescriptor,
            recommendedModel: {
               in: filter.models,
            },
         };
      }

      // Favorites
      if (filter.isFavorite !== undefined) {
         where.isFavorite = filter.isFavorite;
      }

      // Collections
      if (filter.collectionIds && filter.collectionIds.length > 0) {
         where.collectionEntries = {
            some: {
               collectionId: {
                  in: filter.collectionIds,
               },
            },
         };
      }

      // Date Range
      if (filter.dateRange) {
         where.createdAt = {};
         if (filter.dateRange.start) {
            where.createdAt.gte = new Date(filter.dateRange.start);
         }
         if (filter.dateRange.end) {
            where.createdAt.lte = new Date(filter.dateRange.end);
         }
      }

      return where;
   }

   private resolveSortOrder(filter?: DLibraryEntriesPageQuery["filter"]) {
      // Default sort by createdAt desc
      return { createdAt: "desc" as const };
   }

   private getLibraryEntryParamsToWhereFindUniqueInput = (
      params: GetLibraryEntryParams
   ): LibraryEntryWhereUniqueInput => {
      const { userId, entryId, templateDescriptorId } = params;

      if (entryId) {
         return {
            id: entryId,
            userId,
         };
      }

      return {
         userId_templateDescriptorId: {
            userId,
            templateDescriptorId: templateDescriptorId as string,
         },
      };
   };
}
