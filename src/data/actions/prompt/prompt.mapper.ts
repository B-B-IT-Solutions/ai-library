import { map } from "es-toolkit/compat";

import { DPrompt, DPromptTemplate } from "@/data/types/domain/prompt";
import { Prompt } from "@/generated/prisma/browser";
import { PromptTemplate } from "@/generated/prisma/client";

export const toDPromptTemplates = (
   pPrompts: PromptTemplate[]
): DPromptTemplate[] => {
   return map(pPrompts, (dbP) => toDPromptTemplate(dbP));
};

export const toDPromptTemplate = (prompt: PromptTemplate): DPromptTemplate => {
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

export const toDPrompts = (pPrompts: Prompt[]): DPrompt[] => {
   return map(pPrompts, (dbP) => toDPrompt(dbP));
};

export const toDPrompt = (prompt: Prompt): DPrompt => {
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
