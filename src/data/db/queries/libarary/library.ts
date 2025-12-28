import prisma from "@/data/db/prisma";

export const pCreatePurchases = async (
   orderId: string,
   userId: string,
   templateIds: string[]
) => {
   const purchases = templateIds.map((templateId) => ({
      orderId,
      userId,
      templateId,
   }));

   return await prisma.purchase.createMany({
      data: purchases,
      skipDuplicates: true,
   });
};
