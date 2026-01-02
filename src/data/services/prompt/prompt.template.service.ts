import { map } from "es-toolkit/compat";

import {
   getPromptTemplateCategories as pGetPromptTemplateCategories,
   getPromptTemplateDescriptors as pGetPromptTemplates,
} from "@/data/repositories/prompt/prompt.template";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

import { toDPromptTemplateDescriptors } from "./prompt.mapper";

type DGetPromptTemplatesDescriptorsParams = {
   search?: string;
   categories?: string[];
};

export const getPromptTemplateDescriptors = async (
   params?: DGetPromptTemplatesDescriptorsParams
): Promise<DPromptTemplateDescriptor[]> => {
   const data = await pGetPromptTemplates(params);
   return toDPromptTemplateDescriptors(data);
};

export const getPromptTemplateCategories = async (): Promise<string[]> => {
   const categories = await pGetPromptTemplateCategories();
   return map(categories, (c) => c.name);
};
