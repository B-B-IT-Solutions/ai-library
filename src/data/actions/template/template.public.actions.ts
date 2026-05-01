"use server";

import { validate as isValidUuid } from "uuid";

import { EMPTY_PAGE, formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DPromptTemplate,
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateDescriptor,
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";

export const getPublicTemplateDescriptorsPage = async (
   query: DTemplateDescriptorsPageQuery
): Promise<DTemplateDescriptorsPage> => {
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
): Promise<DPromptTemplateDescriptor | null> => {
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
): Promise<DPromptTemplate | null> => {
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
): Promise<DPromptTemplateDataPromptGeneration | null> => {
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
