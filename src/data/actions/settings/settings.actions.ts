"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DGlobalTemplateField,
   DGlobalTemplateFieldUpdate,
} from "@/data/types/domain/settings";
import { ActionResult } from "@/data/types/utils";

export const getGlobalTemplateFields = async (): Promise<
   DGlobalTemplateField[]
> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getGlobalTemplateFields(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const createGlobalTemplateField = async (
   data: DGlobalTemplateFieldUpdate
): Promise<ActionResult<DGlobalTemplateField>> => {
   try {
      const user = await requireUser();
      const service = getService();
      const field = await service.createGlobalTemplateField(user.id, data);
      return {
         success: true,
         message: "Feld erfolgreich erstellt",
         data: field,
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Feld konnte nicht erstellt werden",
      };
   }
};

export const updateGlobalTemplateField = async (
   id: string,
   data: DGlobalTemplateFieldUpdate
): Promise<ActionResult<DGlobalTemplateField>> => {
   try {
      if (!isValidUuid(id)) {
         throw new Error("Invalid field ID.");
      }

      const user = await requireUser();
      const service = getService();
      const field = await service.updateGlobalTemplateField(user.id, id, data);
      return {
         success: true,
         message: "Feld erfolgreich aktualisiert",
         data: field,
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Feld konnte nicht aktualisiert werden",
      };
   }
};

export const deleteGlobalTemplateField = async (
   id: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(id)) {
         throw new Error("Invalid field ID.");
      }

      const user = await requireUser();
      const service = getService();
      await service.deleteGlobalTemplateField(user.id, id);
      return {
         success: true,
         message: "Feld erfolgreich gelöscht",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Feld konnte nicht gelöscht werden",
      };
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getSettingsService();
};
