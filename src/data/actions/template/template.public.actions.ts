"use server";

import { validate as isValidUuid } from "uuid";

import { EMPTY_PAGE, formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DPrompt,
   DPromptContent,
   DPromptGenerationData,
   DPromptsPage,
   DPromptsPageQuery,
} from "@/data/types/domain/prompt";

export const getPublicTemplateDescriptorsPage = async (
   query: DPromptsPageQuery
): Promise<DPromptsPage> => {
   try {
      const service = getService();
      return await service.getPublicTemplateDescriptorsPage(query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
   }
};

export const getPublicTemplateDescriptor = async (
   descriptorId: string
): Promise<DPrompt | null> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const service = getService();
      return await service.getPublicTemplateDescriptor(descriptorId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getPublicPromptTemplate = async (
   templateId: string
): Promise<DPromptContent | null> => {
   try {
      if (!isValidUuid(templateId)) {
         throw new Error("Invalid Template ID.");
      }

      const service = getService();
      return await service.getPublicPromptTemplate(templateId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getPublicPromptGenerationTemplateData = async (
   templateId: string
): Promise<DPromptGenerationData | null> => {
   try {
      if (!isValidUuid(templateId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const service = getService();
      return await service.getPublicTemplateDataForPromptGeneration(templateId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPublicTemplateService();
};
