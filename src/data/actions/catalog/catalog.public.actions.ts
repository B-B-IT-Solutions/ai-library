"use server";

import { isEmpty, trim } from "es-toolkit/compat";

import { EMPTY_PAGE, formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DCatalogEntriesPage,
   DCatalogEntriesPageQuery,
   DCatalogEntryCategory,
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";

export const getPublishedCatalogEntriesPage = async (
   query?: DCatalogEntriesPageQuery
): Promise<DCatalogEntriesPage> => {
   try {
      const service = getService();
      return await service.getPublishedCatalogEntriesPage(query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
   }
};

export const getPublishedCatalogEntryBySlug = async (
   slug: string
): Promise<DCatalogEntryWithContent | null> => {
   try {
      if (isEmpty(trim(slug))) {
         throw new Error("Invalid slug");
      }
      const service = getService();
      return await service.getPublishedCatalogEntryBySlug(slug);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getCatalogEntryCategories = async (): Promise<
   DCatalogEntryCategory[]
> => {
   try {
      const service = getService();
      return await service.getCatalogEntryCategories();
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getCatalogService();
};
