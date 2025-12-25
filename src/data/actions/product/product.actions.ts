"use server";
import { validate as isValidUuid } from "uuid";

import type { BundleValue } from "@/components/products/product/product-details-dialog/types";
import { calculateBundleValue } from "@/components/products/product/product-details-dialog/utils/value-calculator";
import {
   pGetProduct,
   pGetProductPricesByTemplateIds,
   pGetProducts,
} from "@/data/db/queries/product";
import { DProduct } from "@/data/types/domain/product";

import { toDProduct, toDProducts } from "./product.mapper";

export const getProducts = async (): Promise<DProduct[]> => {
   const products = await pGetProducts({ status: "ACTIVE" });
   return toDProducts(products);
};

export const getProduct = async (
   productId: string
): Promise<DProduct | null> => {
   if (isValidUuid(productId)) {
      const product = await pGetProduct({ id: productId });
      if (product) {
         return toDProduct(product);
      }
   }
   return null;
};

/**
 * Calculate bundle value for a product
 * Returns null if not a bundle or if calculation fails
 */
export const getBundleValue = async (
   product: DProduct
): Promise<BundleValue | null> => {
   if (product.type !== "BUNDLE" || !product.bundleItems) {
      return null;
   }

   try {
      // Get template IDs from bundle items
      const templateIds = product.bundleItems
         .map((item) => item.templateId)
         .filter((id): id is string => id !== null);

      if (templateIds.length === 0) {
         return null;
      }

      // Fetch individual prices
      const priceData = await pGetProductPricesByTemplateIds(templateIds);
      const individualPrices = priceData.map((p) => p.price);

      if (individualPrices.length === 0) {
         return null;
      }

      // Calculate bundle value
      return calculateBundleValue({
         bundlePrice: product.price,
         individualPrices,
      });
   } catch (error) {
      console.error("Error calculating bundle value:", error);
      return null;
   }
};
