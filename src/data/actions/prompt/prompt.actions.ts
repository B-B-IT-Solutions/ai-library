"use server";

import { map } from "es-toolkit/compat";
import { revalidatePath } from "next/cache";

import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DPromptDescriptor,
   DPromptDescriptorsPage,
   DPromptDescriptorsPageQuery,
   DPromptUpdate,
} from "@/data/types/domain/prompt";
import { formatError } from "../utils";

export const getPrompts = async (
   query?: DPromptDescriptorsPageQuery
): Promise<DPromptDescriptorsPage> => {
   const service = getPromptSevice();
   return await service.getPrompts(query);
};

export const getPrompt = async (
   id: string
): Promise<DPromptDescriptor | undefined> => {
   const service = getPromptSevice();
   return await service.getPrompt(id);
};

export const getPromptCategories = async (): Promise<string[]> => {
   const service = getPromptSevice();
   const categories = await service.getPromptCategories();
   return map(categories, (c) => c.name);
};

export const createPrompt = async (data: DPromptUpdate) => {
   try {
      const service = getPromptSevice();
      await service.createPrompt(data);
      return {
         success: true,
         message: "Prompt erfolgreich erstellt.",
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const updatePrompt = async (
   promptId: string,
   data: DPromptUpdate,
   createVersion: boolean
) => {
   try {
      const service = getPromptSevice();
      await service.updatePrompt(promptId, data, createVersion);
      return {
         success: true,
         message: "Prompt erfolgreich aktualisiert.",
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const deletePrompt = async (id: string) => {
   try {
      const service = getPromptSevice();
      await service.deletePrompt(id);
      return {
         success: true,
         message: "Prompt erfolgreich gelöscht.",
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const toggleFavorite = async (id: string, isFavorite: boolean) => {
   try {
      const service = getPromptSevice();
      await service.toggleFavorite(id, isFavorite);
      revalidatePath(`/prompts/${id}`);
      return {
         success: true,
         message: isFavorite
            ? "Zu Favoriten hinzugefügt"
            : "Aus Favoriten entfernt",
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

const getPromptSevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPromptService();
};
