"use server";

import { pGetProducts } from "@/data/db/queries/product";
import { DProduct } from "@/data/types/domain/product";

import { toDProducts } from "./product.mapper";

export const getProducts = async (): Promise<DProduct[]> => {
   const products = await pGetProducts({ status: "ACTIVE" });
   return toDProducts(products);
};
