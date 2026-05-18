"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DCatalogEntryCopyResult } from "@/data/types/domain/catalog";
import { ActionResult } from "@/data/types/utils";
import {
   requireCountLimit,
   SubscriptionAccessError,
} from "@/lib/subscription/server-guards";

export const addCatalogEntryToUserTemplates = async (
   catalogEntryId: string
): Promise<ActionResult<DCatalogEntryCopyResult>> => {
   try {
      if (!isValidUuid(catalogEntryId)) {
         throw new Error("Invalid CatalogEntry ID.");
      }

      const user = await requireUser();

      // Check library-item limit before creating a new template from the catalog
      const templateService = getTemplateService();
      const currentCount = await templateService.getPromptsCount(user.id);
      await requireCountLimit("maxLibraryItems", currentCount);

      const service = getCatalogService();
      const descriptor = await service.addCatalogEntryToUserTemplates(
         user.id,
         catalogEntryId
      );

      return {
         success: true,
         message: "Vorlage erfolgreich übernommen.",
         data: {
            templateId: descriptor.id,
         },
      };
   } catch (error) {
      if (error instanceof SubscriptionAccessError) {
         return {
            success: false,
            message: error.message,
            upgradeRequired: true,
         };
      }
      console.error(formatError(error));
      return {
         success: false,
         message: "Vorlage konnte nicht übernommen werden.",
      };
   }
};

const getCatalogService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getCatalogService();
};

const getTemplateService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPromptService();
};
