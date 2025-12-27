"use server";

import { validate as isValidUuid } from "uuid";

import { pGetProduct, pGetProducts } from "@/data/db/queries/product";
import { DProduct } from "@/data/types/domain/product";

import { toDProduct2, toDProducts } from "./product.mapper";

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
         return toDProduct2(product);
      }
   }
   return null;
};
