"use server";

import { validate as isValidUuid } from "uuid";

import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ProductRepository } from "@/data/repositories/product";
import { ServiceFactory } from "@/data/services";
import { DProduct, DProductSitemapData } from "@/data/types/domain/product";

import { toDProductsWithItems, toDProductWithDetails } from "./product.mapper";

export const getProductsForSitemap = async (): Promise<DProductSitemapData[]> => {
   try {
      const service = new ServiceFactory(prisma).getProductService();
      return await service.getProductsSitemapData();
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

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
