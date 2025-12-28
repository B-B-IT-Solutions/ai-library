import prisma from "@/data/db/prisma";
import { ProductWithDetails, ProductWithItems } from "@/data/types/db/product";
import {
   ProductWhereInput,
   ProductWhereUniqueInput,
} from "@/generated/prisma/models";

export const pGetProducts = async (
   where?: ProductWhereInput
): Promise<ProductWithItems[]> => {
   return await prisma.product.findMany({
      where,
      include: {
         productItems: {
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

export const pGetProduct = async (
   where: ProductWhereUniqueInput
): Promise<ProductWithDetails | null> => {
   return await prisma.product.findUnique({
      where,
      include: {
         productItems: {
            include: {
               template: {
                  include: {
                     categories: true,
                  },
               },
            },
         },
         features: {
            orderBy: {
               order: "asc",
            },
         },
         useCases: {
            orderBy: {
               order: "asc",
            },
         },
         examples: {
            orderBy: {
               order: "asc",
            },
         },
         instructions: {
            orderBy: {
               step: "asc",
            },
         },
      },
   });
};
