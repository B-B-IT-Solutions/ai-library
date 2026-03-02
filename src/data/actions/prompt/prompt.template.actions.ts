"use server";

import { map } from "es-toolkit/compat";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DPromptTemplate,
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateDescriptor,
} from "@/data/types/domain/prompt.template";

type DGetPromptTemplatesParams = {
   search?: string;
   categories?: string[];
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
   id: string
): Promise<DPromptTemplate | null> => {
   const service = getService();
   return await service.getPromptTemplate(id);
};

export const getPromptTemplateCategories = async (): Promise<string[]> => {
   const service = getService();
   const categories = await service.getPromptTemplateCategories();
   return map(categories, (c) => c.name);
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPromptTemplateService();
};
