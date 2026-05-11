import { map } from "es-toolkit/compat";

import {
   PromptContentWithFields,
   PromptWithCategories,
} from "@/data/types/db/prompt.template";
import {
   DPromptTemplate,
   DPromptTemplateDescriptor,
   DPromptTemplateField,
} from "@/data/types/domain/prompt.template";
import { PromptTemplateField } from "@/generated/prisma/client";

export const toDTemplateDescriptors = (
   pPrompts: PromptWithCategories[]
): DPromptTemplateDescriptor[] => {
   return map(pPrompts, (dbP) => toDTemplateDescriptor(dbP));
};

export const toDTemplateDescriptor = (
   prompt: PromptWithCategories
): DPromptTemplateDescriptor => {
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
): DPromptTemplate => {
   return {
      id: prompt.promptId,
      content: prompt.content,
      fields: toDTemplateFields(prompt.fields),
      globalFieldIds: map(prompt.globalFields, (gf) => gf.globalFieldId),
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

export const toDTemplateFields = (
   fields: PromptTemplateField[]
): DPromptTemplateField[] => {
   return map(fields, toDTemplateField).sort((a, b) => a.order - b.order);
};

export const toDTemplateField = (
   field: PromptTemplateField
): DPromptTemplateField => {
   return {
      id: field.id,
      promptTemplateId: field.promptTemplateId,
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
