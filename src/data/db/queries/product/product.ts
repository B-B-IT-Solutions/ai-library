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

export const pGetProductById = async (id: string) => {
   return await prisma.product.findUnique({
      where: { id },
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

export const pGetBundleWithTemplates = async (bundleId: string) => {
   return await prisma.product.findUnique({
      where: {
         id: bundleId,
         type: "BUNDLE",
      },
      include: {
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

export const pGetProductsByType = async (type: "TEMPLATE" | "BUNDLE") => {
   return await prisma.product.findMany({
      where: {
         type,
         status: "ACTIVE",
      },
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
