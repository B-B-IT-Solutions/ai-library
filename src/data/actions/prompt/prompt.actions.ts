"use server";

import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DPromptCreate,
   DPromptDescriptor,
   DPromptDescriptorsPage,
   DPromptDescriptorsPageQuery,
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
   return await service.getPromptCategories();
};

export const createPrompt = async (data: DPromptCreate) => {
   try {
      const service = getPromptSevice();
      await service.createPrompt(data);
      return {
         success: true,
         message: "Prompt created sucessfully.",
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
