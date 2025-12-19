import prisma from "@/data/db/prisma";

export const pGetUserPurchases = async (userId: string) => {
   return await prisma.purchase.findMany({
      where: { userId },
      include: {
         template: {
            include: {
               categories: true,
            },
         },
         order: true,
      },
      orderBy: {
         createdAt: "desc",
      },
   });
};

export const pCheckUserHasTemplate = async (
   userId: string,
   templateId: string
) => {
   const purchase = await prisma.purchase.findUnique({
      where: {
         userId_templateId: {
            userId,
            templateId,
         },
      },
   });

   return purchase !== null;
};
