"use server";

import { validate as isValidUuid } from "uuid";

import prisma from "@/data/db/prisma";
import { ProductRepository } from "@/data/db/queries/product";
import { DProduct } from "@/data/types/domain/product";

import { toDProductsWithItems, toDProductWithDetails } from "./product.mapper";

export const getProducts = async (): Promise<DProduct[]> => {
   const productRepository = new ProductRepository(prisma);
   const products = await productRepository.pGetProducts({ status: "ACTIVE" });
   return toDProductsWithItems(products);
};

export const getProduct = async (
   productId: string
): Promise<DProduct | null> => {
   if (isValidUuid(productId)) {
      const productRepository = new ProductRepository(prisma);
      const product = await productRepository.pGetProduct({ id: productId });
      if (product) {
         return toDProductWithDetails(product);
      }
   }
   return null;
};
