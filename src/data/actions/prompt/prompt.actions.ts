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
import { requireUser } from "../auth-utils";
import { formatError } from "../utils";

export const getPrompts = async (
   query?: DPromptDescriptorsPageQuery
): Promise<DPromptDescriptorsPage> => {
   const user = await requireUser();
   const service = getSevice();
   return await service.getPrompts({
      ...query,
      filter: { ...query?.filter, userId: user.id },
   });
};

export const getPrompt = async (
   id: string
): Promise<DPromptDescriptor | undefined> => {
   const service = getSevice();
   return await service.getPrompt(id);
};

export const getPromptCategories = async (): Promise<string[]> => {
   const service = getSevice();
   const categories = await service.getPromptCategories();
   return map(categories, (c) => c.name);
};

export const createPrompt = async (data: DPromptUpdate) => {
   try {
      const user = await requireUser();
      const service = getSevice();
      await service.createPrompt(data, user.id);
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
      const service = getSevice();
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

export const toggleFavorite = async (id: string, isFavorite: boolean) => {
   try {
      const service = getSevice();
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

export const deletePrompt = async (id: string) => {
   try {
      const service = getSevice();
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

const getSevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPromptService();
};
