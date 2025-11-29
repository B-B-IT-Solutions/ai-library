"use server";

import { map } from "es-toolkit/compat";

import {
   getPromptTemplateCategories as pGetPromptTemplateCategories,
   getPromptTemplates as pGetPromptTemplates,
} from "@/data/db/queries/prompt.template";
import { DPromptTemplate } from "@/data/types/domain/prompt";

import { toDPromptTemplates } from "./prompt.mapper";

export const getPromptTemplates = async (): Promise<DPromptTemplate[]> => {
   const data = await pGetPromptTemplates();
   return toDPromptTemplates(data);
};

export const getPromptTemplateCategories = async (): Promise<string[]> => {
   const categories = await pGetPromptTemplateCategories();
   return map(categories, (c) => c.name);
};
