import { DbClient } from "@/data/types/db/common";
import { ProductWithDetails, ProductWithItems } from "@/data/types/db/product";
import {
   ProductWhereInput,
   ProductWhereUniqueInput,
} from "@/generated/prisma/models";

export class ProductRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
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
