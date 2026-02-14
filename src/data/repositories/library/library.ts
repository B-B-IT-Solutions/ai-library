import { map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   LibraryEntryWithPromptTemplate,
   LibraryEntryWithPromptTemplateDescriptor,
} from "@/data/types/db/library";
import {
   LibraryEntryCreateArgs,
   LibraryEntryCreateInput,
   LibraryEntryCreateManyArgs,
   LibraryEntryCreateManyInput,
   LibraryEntryWhereUniqueInput,
} from "@/generated/prisma/models";

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

   async pGetLibraryEntries(
      userId: string
   ): Promise<LibraryEntryWithPromptTemplateDescriptor[]> {
      return await this.prisma.libraryEntry.findMany({
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
   }

   async pGetLibraryEntry(
      params: GetLibraryEntryParams
   ): Promise<LibraryEntryWithPromptTemplate | null> {
      const where = this.getLibraryEntryParamsToWhereFindUniqueInput(params);
      return await this.prisma.libraryEntry.findUnique({
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
