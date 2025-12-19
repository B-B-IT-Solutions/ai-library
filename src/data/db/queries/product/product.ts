import { prisma } from "@/data/db/prisma";
import { Prisma } from "@/generated/prisma/client";

export const pGetProducts = async (where?: Prisma.ProductWhereInput) => {
   return await prisma.product.findMany({
      where,
      include: {
         template: {
            include: {
               categories: true,
            },
         },
         bundleItems: {
            include: {
               template: {
                  include: {
                     categories: true,
                  },
               },
            },
         },
      },
      orderBy: {
         createdAt: "desc",
      },
   });
};
