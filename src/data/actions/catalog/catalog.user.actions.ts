"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DCatalogEntryCopyResult } from "@/data/types/domain/catalog";
import { ActionResult } from "@/data/types/utils";
import { SubscriptionAccessError } from "@/lib/subscription/server-guards";

export const addCatalogEntryToUserPrompts = async (
   catalogEntryId: string
): Promise<ActionResult<DCatalogEntryCopyResult>> => {
   try {
      if (!isValidUuid(catalogEntryId)) {
         throw new Error("Invalid CatalogEntry ID.");
      }

      const user = await requireUser();
      const service = getCatalogService();
      const descriptor = await service.addCatalogEntryToUserPrompts(
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
      console.error(formatError(error));

      if (error instanceof SubscriptionAccessError) {
         return {
            success: false,
            message: error.message,
            upgradeRequired: true,
         };
      }

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
