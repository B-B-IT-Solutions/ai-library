"use server";

import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DProductSitemapData } from "@/data/types/domain/product";

export const getProductsForSitemap = async (): Promise<
   DProductSitemapData[]
> => {
   try {
      const service = getService();
      return await service.getProductsSitemapData();
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getProductService();
};
