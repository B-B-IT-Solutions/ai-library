"use server";

import { validate as isValidUuid } from "uuid";

import { pGetProduct, pGetProducts } from "@/data/db/queries/product";
import { DProduct } from "@/data/types/domain/product";

import { toDProductsWithItems, toDProductWithDetails } from "./product.mapper";

export const getProducts = async (): Promise<DProduct[]> => {
   const products = await pGetProducts({ status: "ACTIVE" });
   return toDProductsWithItems(products);
};

export const getProduct = async (
   productId: string
): Promise<DProduct | null> => {
   if (isValidUuid(productId)) {
      const product = await pGetProduct({ id: productId });
      if (product) {
         return toDProductWithDetails(product);
      }
   }
   return null;
};
