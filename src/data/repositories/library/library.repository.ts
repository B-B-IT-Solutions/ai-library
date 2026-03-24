import { flatMap, isEmpty, map, uniq } from "es-toolkit/compat";

import { Sort } from "@/data/types/common";
import { DbClient } from "@/data/types/db/common";
import { LibraryEntryWithPromptTemplateDescriptor } from "@/data/types/db/library";
import {
   DLibraryCollection,
   DLibraryCollectionUpdate,
   DLibraryEntriesPage,
   DLibraryEntriesPageQuery,
   DLibraryEntry,
   DLibraryEntryWithPromptTemplate,
} from "@/data/types/domain/library";
import {
   LibraryCollectionCreateInput,
   LibraryEntryCountArgs,
   LibraryEntryCreateArgs,
   LibraryEntryCreateInput,
   LibraryEntryCreateManyArgs,
   LibraryEntryCreateManyInput,
   LibraryEntryDeleteArgs,
   LibraryEntryFindManyArgs,
   LibraryEntryOrderByWithRelationInput,
   LibraryEntryWhereInput,
   LibraryEntryWhereUniqueInput,
   PromptTemplateDescriptorWhereInput,
} from "@/generated/prisma/models";

import {
   toDLibraryCollection,
   toDLibraryCollections,
   toDLibraryEntries,
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

   async pGetLibraryEntriesPage(
      userId: string,
      query?: DLibraryEntriesPageQuery
   ): Promise<DLibraryEntriesPage> {
      const pagination = query?.pagination;
      const pageNumber = pagination?.pageNumber ?? 0;
      const pageSize = pagination?.pageSize ?? 20;
      const skip = pageNumber * pageSize;

      const where = this.resolveWhereInput(userId, query?.filter);
      const orderBy = this.resolveOrderBy(query?.sort);

      const args: LibraryEntryFindManyArgs = {
         where,
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy,
         skip,
         take: pageSize,
      };

      const countArgs: LibraryEntryCountArgs = {
         where,
      };

      const [entries, totalEntries] = await Promise.all([
         this.prisma.libraryEntry.findMany(args) as Promise<
            LibraryEntryWithPromptTemplateDescriptor[]
         >,
         this.prisma.libraryEntry.count(countArgs),
      ]);

      return {
         content: toDLibraryEntries(entries),
         pageNumber,
         pageSize,
         numberOfElements: entries.length,
         totalPages: Math.ceil(totalEntries / pageSize),
         totalElements: totalEntries,
      };
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
                        globalFields: true,
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

   async pDeleteLibraryEntry(userId: string, entryId: string) {
      const args: LibraryEntryDeleteArgs = {
         where: { id: entryId, userId },
      };
      return await this.prisma.libraryEntry.delete(args);
   }

   async pDeleteLibraryEntries(userId: string) {
      return await this.prisma.libraryEntry.deleteMany({
         where: { userId },
      });
   }

   // ==================== Filtering & Pagination ====================

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

   // ==================== Collection Entries ====================

   async pGetEntryCollectionIds(
      userId: string,
      entryId: string
   ): Promise<string[]> {
      const collectionEntries =
         await this.prisma.libraryCollectionEntry.findMany({
            where: { entryId },
            select: { collectionId: true },
         });

      return map(collectionEntries, (ce) => ce.collectionId);
   }

   async pUpdateEntryCollections(
      userId: string,
      entryId: string,
      collectionIds: string[]
   ): Promise<void> {
      await this.prisma.libraryCollectionEntry.deleteMany({
         where: { entryId },
      });

      await this.prisma.libraryCollectionEntry.createMany({
         data: map(collectionIds, (collectionId) => ({
            entryId,
            collectionId,
         })),
      });
   }

   private resolveWhereInput(
      userId: string,
      filter?: DLibraryEntriesPageQuery["filter"]
   ): LibraryEntryWhereInput {
      const where: LibraryEntryWhereInput = { userId };

      if (!filter) return where;

      const templateDescriptorWhere: PromptTemplateDescriptorWhereInput = {};

      // Search
      if (filter.search) {
         templateDescriptorWhere.OR = [
            { title: { contains: filter.search, mode: "insensitive" } },
            { description: { contains: filter.search, mode: "insensitive" } },
         ];
      }

      // Categories
      if (!isEmpty(filter.categories)) {
         templateDescriptorWhere.categories = {
            some: {
               name: {
                  in: filter.categories,
               },
            },
         };
      }

      // Models
      if (!isEmpty(filter.models)) {
         templateDescriptorWhere.recommendedModel = {
            in: filter.models,
         };
      }

      if (Object.keys(templateDescriptorWhere).length > 0) {
         where.templateDescriptor = templateDescriptorWhere;
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

      return where;
   }

   private resolveOrderBy(sort?: Sort): LibraryEntryOrderByWithRelationInput {
      if (sort) {
         if (sort.field === "title") {
            return {
               templateDescriptor: {
                  title: sort.order,
               },
            };
         }
         return {
            [sort.field]: sort.order,
         };
      }
      return {
         createdAt: "desc" as const,
      };
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
