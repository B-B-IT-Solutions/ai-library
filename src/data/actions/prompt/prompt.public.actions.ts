"use server";

import { validate as isValidUuid } from "uuid";

import { EMPTY_PAGE, formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DPrompt,
   DPromptGenerationData,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptWithContent,
} from "@/data/types/domain/prompt";

export const getPublicPromptsPage = async (
   query: DPromptsPageQuery
): Promise<DPromptsPage> => {
   try {
      const service = getService();
      return await service.getPublicPromptsPage(query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
   }
};

export const getPublicPrompt = async (
   descriptorId: string
): Promise<DPrompt | null> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const service = getService();
      return await service.getPublicPrompt(descriptorId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getPublicPromptContent = async (
   templateId: string
): Promise<DPromptWithContent | null> => {
   try {
      if (!isValidUuid(templateId)) {
         throw new Error("Invalid Template ID.");
      }

      const service = getService();
      return await service.getPublicPromptContent(templateId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getPublicPromptGenerationData = async (
   templateId: string
): Promise<DPromptGenerationData | null> => {
   try {
      if (!isValidUuid(templateId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const service = getService();
      return await service.getPublicPromptGenerationData(templateId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPublicPromptService();
};
