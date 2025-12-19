import prisma from "@/data/db/prisma";
import { ProductWithTemplateBundleItems } from "@/data/types/db/product";
import { ProductWhereInput } from "@/generated/prisma/models";

export const pGetProducts = async (
   where?: ProductWhereInput
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
