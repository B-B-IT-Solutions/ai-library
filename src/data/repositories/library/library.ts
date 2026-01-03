import { map } from "es-toolkit/compat";

import { DbClient } from "@/data/types/db/common";
import { LibraryEntryWithTemplate } from "@/data/types/db/library";

export class LibraryRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetLibraryEntries(
      userId: string
   ): Promise<LibraryEntryWithTemplate[]> {
      return await this.prisma.libraryEntry.findMany({
         where: { userId },
         include: {
            template: {
               include: {
                  categories: true,
                  promptTemplate: true,
               },
            },
         },
         orderBy: {
            createdAt: "desc",
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
