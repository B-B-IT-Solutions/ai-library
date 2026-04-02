"use server";
import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
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

type DGetPromptTemplatesParams = {
   search?: string;
   categories?: string[];
};

export const getTemplateDescriptorsPage = async (
   query?: DTemplateDescriptorsPageQuery
): Promise<DTemplateDescriptorsPage> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getTemplateDescriptorsPage(user.id, query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
   }
};

export const getPromptGenerationTemplateData = async (
   templateId: string
): Promise<DPromptTemplateDataPromptGeneration | null> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getTemplateDataForPromptGeneration(
         user.id,
         templateId
      );
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getPromptTemplates = async (
   params?: DGetPromptTemplatesParams
): Promise<DPromptTemplateDescriptor[]> => {
   const service = getService();
   return await service.getPromptTemplateDescriptors(params);
};

export const getPromptTemplate = async (
   templateId: string
): Promise<DPromptTemplate | null> => {
   try {
      if (!isValidUuid(templateId)) {
         throw new Error("Invalid Template ID.");
      }

      const user = await requireUser();
      const service = getService();
      return await service.getPromptTemplate(user.id, templateId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getPromptTemplateCategories = async (): Promise<string[]> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getPromptTemplateCategories(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPromptTemplateService();
};
