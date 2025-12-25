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
      },
   });
};

/**
 * Get product prices by template IDs
 * Used for calculating bundle value
 */
export const pGetProductPricesByTemplateIds = async (
   templateIds: string[]
): Promise<{ templateId: string; price: number }[]> => {
   const products = await prisma.product.findMany({
      where: {
         templateId: { in: templateIds },
         type: "TEMPLATE",
         status: "ACTIVE",
      },
      select: {
         templateId: true,
         price: true,
      },
   });

   return products.map((p) => ({
      templateId: p.templateId!,
      price: Number(p.price),
   }));
};
