"use server";

import { DPromptTemplate } from "@/data/domain/prompt";
import { getPromptTemplates as pGetPromptTemplates } from "@/db/queries/prompt.template";
import { toDPromptTemplates } from "./prompt.mapper";

export const getPromptTemplates = async (): Promise<DPromptTemplate[]> => {
   const data = await pGetPromptTemplates();
   return toDPromptTemplates(data);
};
