"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DGlobalPromptField,
   DGlobalPromptFieldUpdate,
} from "@/data/types/domain/settings";
import { ActionResult } from "@/data/types/utils";

export const getGlobalPromptFields = async (): Promise<
   DGlobalPromptField[]
> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getGlobalPromptFields(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const createGlobalPromptField = async (
   data: DGlobalPromptFieldUpdate
): Promise<ActionResult<DGlobalPromptField>> => {
   try {
      const user = await requireUser();
      const service = getService();
      const field = await service.createGlobalPromptField(user.id, data);
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

export const updateGlobalPromptField = async (
   id: string,
   data: DGlobalPromptFieldUpdate
): Promise<ActionResult<DGlobalPromptField>> => {
   try {
      if (!isValidUuid(id)) {
         throw new Error("Invalid field ID.");
      }

      const user = await requireUser();
      const service = getService();
      const field = await service.updateGlobalPromptField(user.id, id, data);
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

export const deleteGlobalPromptField = async (
   id: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(id)) {
         throw new Error("Invalid field ID.");
      }

      const user = await requireUser();
      const service = getService();
      await service.deleteGlobalPromptField(user.id, id);
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
