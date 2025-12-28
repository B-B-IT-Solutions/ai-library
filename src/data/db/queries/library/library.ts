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

export const pCreateLibraryEntry = async (
   orderId: string,
   userId: string,
   templateIds: string[]
) => {
   const purchases = templateIds.map((templateId) => ({
      orderId,
      userId,
      templateId,
   }));

   return await prisma.libraryEntry.createMany({
      data: purchases,
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
