"use server";

import { EMPTY_PAGE, formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DPromptTemplateDataPromptGeneration,
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

export const getPublicPromptGenerationTemplateData = async (
   templateId: string
): Promise<DPromptTemplateDataPromptGeneration | null> => {
   try {
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
