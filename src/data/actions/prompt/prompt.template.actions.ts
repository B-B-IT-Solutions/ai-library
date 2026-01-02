"use server";

import { map } from "es-toolkit/compat";

import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

type DGetPromptTemplatesParams = {
   search?: string;
   categories?: string[];
};

export const getPromptTemplates = async (
   params?: DGetPromptTemplatesParams
): Promise<DPromptTemplateDescriptor[]> => {
   const service = getPromptTemplateService();
   return await service.getPromptTemplateDescriptors(params);
};

export const getPromptTemplateCategories = async (): Promise<string[]> => {
   const service = getPromptTemplateService();
   const categories = await service.getPromptTemplateCategories();
   return map(categories, (c) => c.name);
};

const getPromptTemplateService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPromptTemplateService();
};
