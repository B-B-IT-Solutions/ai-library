import { map } from "es-toolkit/compat";

import { PromptsPage, PromptWithCategories } from "@/data/types/db/prompt";
import { PromptTemplateWithCategories } from "@/data/types/db/prompt.template";
import { DPrompt, DPromptsPage } from "@/data/types/domain/prompt";
import { DPromptTemplate } from "@/data/types/domain/prompt.template";

export const toDPromptTemplates = (
   pPrompts: PromptTemplateWithCategories[]
): DPromptTemplate[] => {
   return map(pPrompts, (dbP) => toDPromptTemplate(dbP));
};

export const toDPromptTemplate = (
   prompt: PromptTemplateWithCategories
): DPromptTemplate => {
   return {
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      categories: prompt.categories,
      recommendedModel: prompt.recommendedModel,
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

export const toDPromptsPage = (pPromptsPage: PromptsPage): DPromptsPage => {
   return {
      ...pPromptsPage,
      content: toDPrompts(pPromptsPage.content),
   };
};

export const toDPrompts = (pPrompts: PromptWithCategories[]): DPrompt[] => {
   return map(pPrompts, (dbP) => toDPrompt(dbP));
};

export const toDPrompt = (prompt: PromptWithCategories): DPrompt => {
   return {
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      categories: prompt.categories,
      recommendedModel: prompt.recommendedModel,
      followUpPrompts: prompt.followUpPrompts,
      currentVersion: prompt.currentVersion,
      isFavorite: prompt.isFavorite,
      versions: [],
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};
