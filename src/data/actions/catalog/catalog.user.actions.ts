"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DCatalogEntryCopyResult } from "@/data/types/domain/catalog";
import { ActionResult } from "@/data/types/utils";

export const copyCatalogEntryToUserTemplates = async (
   catalogEntryId: string
): Promise<ActionResult<DCatalogEntryCopyResult>> => {
   try {
      if (!isValidUuid(catalogEntryId)) {
         throw new Error("Invalid CatalogEntry ID.");
      }

      const user = await requireUser();
      const service = getService();
      const descriptor = await service.copyCatalogEntryToUserTemplates(
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
