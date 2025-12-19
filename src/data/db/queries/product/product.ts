import { prisma } from "@/data/db/prisma";
import { ProductWithTemplateBundleItems } from "@/data/types/db/product";
import { Prisma } from "@/generated/prisma/client";

export const pGetProducts = async (
   where?: Prisma.ProductWhereInput
): Promise<ProductWithTemplateBundleItems[]> => {
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
