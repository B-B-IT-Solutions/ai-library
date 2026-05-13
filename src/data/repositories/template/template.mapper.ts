import { map } from "es-toolkit/compat";

import {
   PromptContentWithFields,
   PromptWithCategories,
} from "@/data/types/db/prompt";
import {
   DPrompt,
   DPromptContent,
   DPromptField,
} from "@/data/types/domain/prompt";
import { PromptField } from "@/generated/prisma/client";

export const toDTemplateDescriptors = (
   pPrompts: PromptWithCategories[]
): DPrompt[] => {
   return map(pPrompts, (dbP) => toDTemplateDescriptor(dbP));
};

export const toDTemplateDescriptor = (
   prompt: PromptWithCategories
): DPrompt => {
   return {
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      categories: prompt.categories,
      recommendedModel: prompt.recommendedModel,
      isFavorite: prompt.isFavorite,
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

export const toDPromptTemplate = (
   prompt: PromptContentWithFields
): DPromptContent => {
   return {
      id: prompt.promptId,
      content: prompt.content,
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
