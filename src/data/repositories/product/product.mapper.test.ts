import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import { ProductSitemapData } from "@/data/types/db/product";
import { DProductSitemapData } from "@/data/types/domain/product";

import {
   toDProductSitemapData,
   toDProductsSitemapData,
} from "./product.mapper";

const toDProductsSitemapDataInternal = (
   products: ProductSitemapData[]
): DProductSitemapData[] => {
   return map(products, (e) => toDProductSitemapDataInternal(e));
};

const toDProductSitemapDataInternal = (
   product: ProductSitemapData
): DProductSitemapData => {
   return {
      id: product.id,
      updatedAt: product.updatedAt.toISOString(),
   };
};

describe("toDProductsSitemapData tests", () => {
   it("toDProductsSitemapData test", async () => {
      const entries = ptestData.pProductsSitemapData();
      const result = toDProductsSitemapData(entries);
      const expectedResult = toDProductsSitemapDataInternal(entries);
      expect(result).toEqual(expectedResult);
   });

   it("toDProductSitemapData test", async () => {
      const entry = ptestData.pProductSitemapData();
      const result = toDProductSitemapData(entry);
      const expectedResult = toDProductSitemapDataInternal(entry);
      expect(result).toEqual(expectedResult);
   });
});
