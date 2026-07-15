import { map } from "es-toolkit/compat";

import {
   PromptCategoryWithCount,
   PromptPreview,
   PromptWithCategories,
   PromptWithContent,
} from "@/data/types/db/prompt";
import {
   DPrompt,
   DPromptCategoryUsage,
   DPromptPreview,
   DPromptVariable,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { PromptField } from "@/generated/prisma/client";

export const toDPromptPreviews = (
   pPrompts: PromptPreview[]
): DPromptPreview[] => {
   return map(pPrompts, (dbP) => toDPromptPreview(dbP));
};

export const toDPromptPreview = (prompt: PromptPreview): DPromptPreview => {
   return {
      id: prompt.id,
      title: prompt.title,
   };
};

export const toDPrompts = (pPrompts: PromptWithCategories[]): DPrompt[] => {
   return map(pPrompts, (dbP) => toDPrompt(dbP));
};

export const toDPrompt = (prompt: PromptWithCategories): DPrompt => {
   return {
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      recommendedModel: prompt.recommendedModel,
      isFavorite: prompt.isFavorite,
      categories: prompt.categories,
      fields: [],
      globalFieldIds: [],
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

export const toDPromptWithContent = (
   prompt: PromptWithContent
): DPromptWithContent => {
   return {
      ...toDPrompt(prompt),
      content: prompt.content.content,
      fields: toDPromptVariables(prompt.fields),
      globalFieldIds: map(prompt.globalFields, (gf) => gf.globalFieldId),
   };
};

export const toDPromptVariables = (
   fields: PromptField[]
): DPromptVariable[] => {
   return map(fields, toDPromptVariable).sort((a, b) => a.order - b.order);
};

export const toDPromptVariable = (field: PromptField): DPromptVariable => {
   return {
      id: field.id,
      promptId: field.promptId,
      name: field.name,
      label: field.label,
      description: field.description,
      type: field.type,
      required: field.required,
      order: field.order,
      defaultValue: field.defaultValue,
      options: field.options as string[] | undefined,
   };
};

export const toDPromptCategoryUsages = (
   categories: PromptCategoryWithCount[]
): DPromptCategoryUsage[] => {
   return map(categories, toDPromptCategoryUsage);
};

export const toDPromptCategoryUsage = (
   category: PromptCategoryWithCount
): DPromptCategoryUsage => {
   return {
      id: category.id,
      name: category.name,
      count: category._count.prompts,
   };
};
