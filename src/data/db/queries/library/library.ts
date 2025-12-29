import { map } from "es-toolkit/compat";

import prisma from "@/data/db/prisma";
import { LibraryEntryWithTemplate } from "@/data/types/db/library";

export const pGetLibraryEntries = async (
   userId: string
): Promise<LibraryEntryWithTemplate[]> => {
   return await prisma.libraryEntry.findMany({
      where: { userId },
      include: {
         template: {
            include: {
               categories: true,
            },
         },
      },
      orderBy: {
         createdAt: "desc",
      },
   });
};

export const pCreateLibraryEntries = async (
   orderId: string,
   userId: string,
   productId: string,
   templateIds: string[]
) => {
   const entries = map(templateIds, (templateId) => ({
      orderId,
      userId,
      productId,
      templateId,
   }));

   await prisma.libraryEntry.createMany({
      data: entries,
      skipDuplicates: true,
   });
};

export const pCheckUserHasTemplate = async (
   userId: string,
   templateId: string
) => {
   const librayEntry = await prisma.libraryEntry.findUnique({
      where: {
         userId_templateId: {
            userId,
            templateId,
         },
      },
   });

   return librayEntry !== null;
};
