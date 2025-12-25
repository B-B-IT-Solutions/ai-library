import { map } from "es-toolkit/compat";

import prisma from "@/data/db/prisma";
import { ProductWithTemplateBundleItems } from "@/data/types/db/product";
import {
   ProductWhereInput,
   ProductWhereUniqueInput,
} from "@/generated/prisma/models";

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
      orderBy: {
         createdAt: "desc",
      },
   });
};

export const pGetProduct = async (
   where: ProductWhereUniqueInput
): Promise<ProductWithTemplateBundleItems | null> => {
   return await prisma.product.findUnique({
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
