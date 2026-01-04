import { map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import {
   LibraryEntryWithPromptTemplate,
   LibraryEntryWithPromptTemplateDescriptor,
} from "@/data/types/db/library";

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
      entryId: string,
      userId: string
   ): Promise<LibraryEntryWithPromptTemplate | null> {
      return await this.prisma.libraryEntry.findFirst({
         where: {
            id: entryId,
            userId,
         },
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
                  promptTemplate: true,
               },
            },
         },
      });
   }

   async pCreateLibraryEntries(
      orderId: string,
      userId: string,
      productId: string,
      templateIds: string[]
   ) {
      const entries = map(templateIds, (templateId) => ({
         orderId,
         userId,
         productId,
         templateId,
      }));

      await this.prisma.libraryEntry.createMany({
         data: entries,
         skipDuplicates: true,
      });
   }

   async pCheckUserHasTemplate(userId: string, templateId: string) {
      const entry = await this.prisma.libraryEntry.findUnique({
         where: {
            userId_templateId: {
               userId,
               templateId,
            },
         },
      });

      return entry !== null;
   }
}
