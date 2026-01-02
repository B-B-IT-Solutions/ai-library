"use server";

import { map } from "es-toolkit/compat";

import {
   getPromptTemplateCategories as pGetPromptTemplateCategories,
   getPromptTemplateDescriptors as pGetPromptTemplates,
} from "@/data/repositories/prompt/prompt.template";
import { DPromptTemplate } from "@/data/types/domain/prompt.template";

import { toDPromptTemplates } from "./prompt.mapper";

type DGetPromptTemplatesParams = {
   search?: string;
   categories?: string[];
};

export const getPromptTemplates = async (
   params?: DGetPromptTemplatesParams
): Promise<DPromptTemplate[]> => {
   const data = await pGetPromptTemplates(params);
   return toDPromptTemplates(data);
};

export const getPromptTemplateCategories = async (): Promise<string[]> => {
   const categories = await pGetPromptTemplateCategories();
   return map(categories, (c) => c.name);
};
