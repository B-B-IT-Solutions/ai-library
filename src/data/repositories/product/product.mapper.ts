import { map } from "es-toolkit/compat";

import { ProductSitemapData } from "@/data/types/db/product";
import { DProductSitemapData } from "@/data/types/domain/product";

export const toDProductsSitemapData = (
   products: ProductSitemapData[]
): DProductSitemapData[] => {
   return map(products, (e) => toDProductSitemapData(e));
};

export const toDProductSitemapData = (
   entry: ProductSitemapData
): DProductSitemapData => {
   return {
      id: entry.id,
      updatedAt: entry.updatedAt.toISOString(),
   };
};
