import { map } from "es-toolkit/compat";

import {
   PromptWithCategories,
   PromptWithContent,
} from "@/data/types/db/prompt";
import {
   DPrompt,
   DPromptContent,
   DPromptField,
} from "@/data/types/domain/prompt";
import { PromptField } from "@/generated/prisma/client";

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
): DPromptContent => {
   return {
      ...toDPrompt(prompt),
      content: prompt.content.content,
      fields: toDTemplateFields(prompt.fields),
      globalFieldIds: map(prompt.globalFields, (gf) => gf.globalFieldId),
   };
};

export const toDTemplateFields = (fields: PromptField[]): DPromptField[] => {
   return map(fields, toDTemplateField).sort((a, b) => a.order - b.order);
};

export const toDTemplateField = (field: PromptField): DPromptField => {
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
