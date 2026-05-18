"use server";
import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE, formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DPrompt0,
   DPrompt0sPage,
   DPrompt0sPageQuery,
   DPrompt0Update,
} from "@/data/types/domain/prompt0";

export const getPrompt0s = async (
   query?: DPrompt0sPageQuery
): Promise<DPrompt0sPage> => {
   try {
      const user = await requireUser();
      const service = getSevice();
      return await service.getPrompt0s(user.id, query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
   }
};

export const getPrompt0 = async (
   promptId: string
): Promise<DPrompt0 | null> => {
   try {
      if (!isValidUuid(promptId)) {
         throw new Error("Invalid Prompt ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      return await service.getPrompt0(user.id, promptId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getPrompt0Categories = async (): Promise<string[]> => {
   try {
      const user = await requireUser();
      const service = getSevice();
      return await service.getPrompt0Categories(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const createPrompt0 = async (data: DPrompt0Update) => {
   try {
      const user = await requireUser();
      const service = getSevice();
      await service.createPrompt0(user.id, data);
      return {
         success: true,
         message: "Prompt erfolgreich erstellt.",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Prompt konnte nicht erstellt werden",
      };
   }
};

export const updatePrompt0 = async (
   promptId: string,
   data: DPrompt0Update,
   createVersion: boolean
) => {
   try {
      if (!isValidUuid(promptId)) {
         throw new Error("Invalid Prompt ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      await service.updatePrompt0(user.id, promptId, data, createVersion);
      return {
         success: true,
         message: "Prompt erfolgreich aktualisiert.",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Prompt konnte nicht aktualisiert werden",
      };
   }
};

export const deletePrompt0 = async (promptId: string) => {
   try {
      if (!isValidUuid(promptId)) {
         throw new Error("Invalid Prompt ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      await service.deletePrompt0(user.id, promptId);
      return {
         success: true,
         message: "Prompt erfolgreich gelöscht.",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Prompt konnte nicht gelöscht werden",
      };
   }
};

export const toggleFavorite = async (promptId: string, isFavorite: boolean) => {
   try {
      if (!isValidUuid(promptId)) {
         throw new Error("Invalid Prompt ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      await service.toggleFavorite(user.id, promptId, isFavorite);

      return {
         success: true,
         message: isFavorite
            ? "Zu Favoriten hinzugefügt"
            : "Aus Favoriten entfernt",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Prompt konnte nicht aktualisiert werden",
      };
   }
};

const getSevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPrompt0Service();
};
