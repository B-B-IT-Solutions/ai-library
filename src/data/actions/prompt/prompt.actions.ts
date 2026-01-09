"use server";

import { map } from "es-toolkit/compat";
import { revalidatePath } from "next/cache";

import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DPromptCreate,
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

export const createPrompt = async (data: DPromptCreate) => {
   try {
      const service = getPromptSevice();
      await service.createPrompt(data);
      revalidatePath("/prompts");
      return {
         success: true,
         message: "Prompt created successfully.",
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const updatePrompt = async (data: DPromptUpdate) => {
   try {
      const service = getPromptSevice();
      await service.updatePrompt(data);
      revalidatePath("/prompts");
      revalidatePath(`/prompts/${data.id}`);
      return {
         success: true,
         message: data.createNewVersion
            ? "Prompt updated successfully. New version created."
            : "Prompt updated successfully.",
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
      revalidatePath("/prompts");
      return {
         success: true,
         message: "Prompt deleted successfully.",
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
      revalidatePath("/prompts");
      revalidatePath(`/prompts/${id}`);
      return {
         success: true,
         message: isFavorite ? "Added to favorites" : "Removed from favorites",
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
