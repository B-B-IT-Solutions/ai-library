"use server";

import { isEmpty } from "es-toolkit/compat";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE, formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DCatalogCategory,
   DCatalogEntriesPage,
   DCatalogEntriesPageQuery,
   DCatalogEntry,
} from "@/data/types/domain/catalog";

export const getCatalogEntriesPage = async (
   query?: DCatalogEntriesPageQuery
): Promise<DCatalogEntriesPage> => {
   try {
      const service = getService();
      return await service.getPublishedEntriesPage(query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
   }
};

export const getCatalogEntryBySlug = async (
   slug: string
): Promise<DCatalogEntry | null> => {
   try {
      if (isEmpty(slug)) {
         throw new Error("Invalid slug");
      }
      const service = getService();
      return await service.getPublishedEntryBySlug(slug);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getCatalogCategories = async (): Promise<DCatalogCategory[]> => {
   try {
      const service = getService();
      return await service.getCategories();
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const copyCatalogEntryToUserLibrary = async (
   catalogEntryId: string
): Promise<
   { success: true; templateId: string } | { success: false; error: string }
> => {
   try {
      const user = await requireUser();
      const service = getService();
      const descriptor = await service.copyEntryToUserLibrary(
         catalogEntryId,
         user.id
      );
      return { success: true, templateId: descriptor.id };
   } catch (error) {
      return { success: false, error: formatError(error) };
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getCatalogService();
};
