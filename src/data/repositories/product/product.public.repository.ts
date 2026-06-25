import { DbClient } from "@/data/types/db/common";
import { DProductSitemapData } from "@/data/types/domain/product";
import { ProductFindManyArgs } from "@/generated/prisma/models";

import { toDProductsSitemapData } from "./product.mapper";

export class PublicProductRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetProductsSitemapData(): Promise<DProductSitemapData[]> {
      const args = {
         where: { status: "ACTIVE" },
         select: { id: true, updatedAt: true },
         orderBy: { createdAt: "asc" },
      } satisfies ProductFindManyArgs;

      const data = await this.prisma.product.findMany(args);
      return toDProductsSitemapData(data);
   }
}
