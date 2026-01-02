import { map } from "es-toolkit/compat";

import { PromptDescriptorWithCategories } from "@/data/types/db/prompt";
import { PromptTemplateDescriptorWithCategories } from "@/data/types/db/prompt.template";
import { DPrompt } from "@/data/types/domain/prompt";
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
