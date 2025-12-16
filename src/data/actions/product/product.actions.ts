"use server";

import { validate as isValidUuid } from "uuid";

import {
   pGetActiveSubscriptionPlans,
   pGetBundleWithTemplates,
   pGetProductById,
   pGetProducts,
   pGetProductsByType,
} from "@/data/db/queries/product";
import { DProduct } from "@/data/types/domain/product";

import { toDProduct, toDProducts } from "./product.mapper";

export const getProducts = async (): Promise<DProduct[]> => {
   const products = await pGetProducts({ status: "ACTIVE" });
   return toDProducts(products);
};

export const getProductById = async (id: string): Promise<DProduct | undefined> => {
   if (!isValidUuid(id)) {
      return undefined;
   }

   const product = await pGetProductById(id);
   if (!product) {
      return undefined;
   }

   return toDProduct(product);
};

export const getBundles = async (): Promise<DProduct[]> => {
   const bundles = await pGetProductsByType("BUNDLE");
   return toDProducts(bundles);
};

export const getSubscriptionPlans = async (): Promise<DProduct[]> => {
   const plans = await pGetActiveSubscriptionPlans();
   return toDProducts(plans);
};

export const getProductsByType = async (
   type: "TEMPLATE" | "BUNDLE" | "SUBSCRIPTION"
): Promise<DProduct[]> => {
   const products = await pGetProductsByType(type);
   return toDProducts(products);
};
