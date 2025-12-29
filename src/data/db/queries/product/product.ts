import { ProductWithDetails, ProductWithItems } from "@/data/types/db/product";
import { PrismaClient } from "@/generated/prisma/client";
import {
   ProductWhereInput,
   ProductWhereUniqueInput,
} from "@/generated/prisma/models";

export class ProductRepository {
   private prisma: PrismaClient;

   constructor(prisma: PrismaClient) {
      this.prisma = prisma;
   }

   async pGetProducts(where?: ProductWhereInput): Promise<ProductWithItems[]> {
      return await this.prisma.product.findMany({
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
   }

   async pGetProduct(
      where: ProductWhereUniqueInput
   ): Promise<ProductWithDetails | null> {
      return await this.prisma.product.findUnique({
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
   }
}
