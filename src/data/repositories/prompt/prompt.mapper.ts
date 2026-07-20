import { map } from "es-toolkit/compat";

import {
   PromptCategoryWithUsage,
   PromptModelWithUsage,
   PromptPreview,
   PromptWithCategories,
   PromptWithContent,
} from "@/data/types/db/prompt";
import {
   DPrompt,
   DPromptCategoryWithUsage,
   DPromptModelWithUsage,
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
      model: prompt.model?.name ?? "",
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

export const toDPromptCategoriesWithUsage = (
   categories: PromptCategoryWithUsage[]
): DPromptCategoryWithUsage[] => {
   return map(categories, toDPromptCategoryWithUsage);
};

export const toDPromptCategoryWithUsage = (
   category: PromptCategoryWithUsage
): DPromptCategoryWithUsage => {
   return {
      id: category.id,
      name: category.name,
      count: category._count.prompts,
   };
};

export const toDPromptModelsWithUsage = (
   models: PromptModelWithUsage[]
): DPromptModelWithUsage[] => {
   return map(models, toDPromptModelWithUsage);
};

export const toDPromptModelWithUsage = (
   model: PromptModelWithUsage
): DPromptModelWithUsage => {
   return {
      id: model.id,
      name: model.name,
      count: model._count.prompts,
   };
};
