import { map } from "es-toolkit/compat";

import {
   PromptDescriptorsPage,
   PromptDescriptorWithCategories,
} from "@/data/types/db/prompt";
import { PromptTemplateDescriptorWithCategories } from "@/data/types/db/prompt.template";
import { DPrompt, DPromptDescriptorsPage } from "@/data/types/domain/prompt";
import { DPromptTemplate } from "@/data/types/domain/prompt.template";

export const toDPromptTemplates = (
   pPrompts: PromptTemplateDescriptorWithCategories[]
): DPromptTemplate[] => {
   return map(pPrompts, (dbP) => toDPromptTemplate(dbP));
};

export const toDPromptTemplate = (
   prompt: PromptTemplateDescriptorWithCategories
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

export const toDPromptsPage = (
   pPromptsPage: PromptDescriptorsPage
): DPromptDescriptorsPage => {
   return {
      ...pPromptsPage,
      content: toDPrompts(pPromptsPage.content),
   };
};

export const toDPrompts = (
   pPrompts: PromptDescriptorWithCategories[]
): DPrompt[] => {
   return map(pPrompts, (dbP) => toDPrompt(dbP));
};

export const toDPrompt = (prompt: PromptDescriptorWithCategories): DPrompt => {
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
