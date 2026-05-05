"use server";

import { isEmpty, trim } from "es-toolkit/compat";
import { validate as isValidUuid } from "uuid";

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
   DCatalogEntryCopyResult,
} from "@/data/types/domain/catalog";
import { ActionResult } from "@/data/types/utils";

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
): Promise<DCatalogEntry | null> => {
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

export const getCatalogCategories = async (): Promise<DCatalogCategory[]> => {
   try {
      const service = getService();
      return await service.getCategories();
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const copyCatalogEntryToUserTemplates = async (
   catalogEntryId: string
): Promise<ActionResult<DCatalogEntryCopyResult>> => {
   try {
      if (!isValidUuid(catalogEntryId)) {
         throw new Error("Invalid CatalogEntry ID.");
      }

      const user = await requireUser();
      const service = getService();
      const descriptor = await service.copyEntryToUserTemplates(
         catalogEntryId,
         user.id
      );

      return {
         success: true,
         message: "Vorlage erfolgreich übernommen.",
         data: {
            templateId: descriptor.id,
         },
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Vorlage konnte nicht übernommen werden.",
      };
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getCatalogService();
};
