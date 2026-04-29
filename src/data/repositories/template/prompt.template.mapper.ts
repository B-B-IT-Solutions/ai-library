import { map } from "es-toolkit/compat";

import {
   PromptTemplateDescriptorWithCategories,
   PromptTemplateDescriptorWithTemplate,
   PromptTemplateWithFields,
} from "@/data/types/db/prompt.template";
import {
   DPromptTemplate,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateField,
} from "@/data/types/domain/prompt.template";
import { PromptTemplateField } from "@/generated/prisma/client";

export const toDPromptTemplateDescriptorWithTemplate = (
   desciptor: PromptTemplateDescriptorWithTemplate
): DPromptTemplateDescriptorWithTemplate => {
   const dDescriptor = toDPromptTemplateDescriptor(desciptor);
   const promptTemplate = toDPromptTemplate(desciptor.promptTemplate);
   return {
      ...dDescriptor,
      promptTemplate,
   };
};

export const toDPromptTemplateDescriptors = (
   pPrompts: PromptTemplateDescriptorWithCategories[]
): DPromptTemplateDescriptor[] => {
   return map(pPrompts, (dbP) => toDPromptTemplateDescriptor(dbP));
};

export const toDPromptTemplateDescriptor = (
   prompt: PromptTemplateDescriptorWithCategories
): DPromptTemplateDescriptor => {
   return {
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      categories: prompt.categories,
      recommendedModel: prompt.recommendedModel,
      promptTemplateId: prompt.promptTemplateId,
      isFavorite: prompt.isFavorite,
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

export const toDPromptTemplate = (
   prompt: PromptTemplateWithFields
): DPromptTemplate => {
   return {
      id: prompt.id,
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
