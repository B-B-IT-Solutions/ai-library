"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DGlobalField, DGlobalFieldUpdate } from "@/data/types/domain/global-field";
import { ActionResult } from "@/data/types/utils";

export const getGlobalFields = async (): Promise<DGlobalField[]> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getGlobalFields(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const createGlobalField = async (
   data: DGlobalFieldUpdate
): Promise<ActionResult<DGlobalField>> => {
   try {
      const user = await requireUser();
      const service = getService();
      const field = await service.createGlobalField(user.id, data);
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

export const updateGlobalField = async (
   id: string,
   data: DGlobalFieldUpdate
): Promise<ActionResult<DGlobalField>> => {
   try {
      if (!isValidUuid(id)) {
         throw new Error("Invalid field ID.");
      }

      const user = await requireUser();
      const service = getService();
      const field = await service.updateGlobalField(id, user.id, data);
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

export const deleteGlobalField = async (
   id: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(id)) {
         throw new Error("Invalid field ID.");
      }

      const user = await requireUser();
      const service = getService();
      await service.deleteGlobalField(id, user.id);
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
   return factory.getGlobalFieldService();
};
