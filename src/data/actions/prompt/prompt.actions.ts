"use server";
import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE, formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DPromptDescriptor,
   DPromptDescriptorsPage,
   DPromptDescriptorsPageQuery,
   DPromptUpdate,
} from "@/data/types/domain/prompt";

export const getPrompts = async (
   query?: DPromptDescriptorsPageQuery
): Promise<DPromptDescriptorsPage> => {
   try {
      const user = await requireUser();
      const service = getSevice();
      return await service.getPrompts(user.id, query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
   }
};

export const getPrompt = async (
   promptId: string
): Promise<DPromptDescriptor | null> => {
   try {
      if (!isValidUuid(promptId)) {
         throw new Error("Invalid Prompt ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      return await service.getPrompt(user.id, promptId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getPromptCategories = async (): Promise<string[]> => {
   try {
      const user = await requireUser();
      const service = getSevice();
      return await service.getPromptCategories();
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const createPrompt = async (data: DPromptUpdate) => {
   try {
      const user = await requireUser();
      const service = getSevice();
      await service.createPrompt(user.id, data);
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

export const updatePrompt = async (
   promptId: string,
   data: DPromptUpdate,
   createVersion: boolean
) => {
   try {
      if (!isValidUuid(promptId)) {
         throw new Error("Invalid Prompt ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      await service.updatePrompt(user.id, promptId, data, createVersion);
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

export const deletePrompt = async (promptId: string) => {
   try {
      if (!isValidUuid(promptId)) {
         throw new Error("Invalid Prompt ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      await service.deletePrompt(user.id, promptId);
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

const getSevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPromptService();
};
