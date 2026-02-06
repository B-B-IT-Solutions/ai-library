import { map } from "es-toolkit/compat";

import {
   PromptTemplateDescriptorWithCategories,
   PromptTemplateDescriptorWithPrompt,
   PromptTemplateWithFields,
} from "@/data/types/db/prompt.template";
import {
   DPromptTemplate,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithPrompt,
   DPromptTemplateField,
} from "@/data/types/domain/prompt.template";
import { PromptTemplateField } from "@/generated/prisma/client";

export const toDPromptTemplateDescriptorWithPrompt = (
   desciptor: PromptTemplateDescriptorWithPrompt
): DPromptTemplateDescriptorWithPrompt => {
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
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

export const toDPromptTemplate = (
   prompt: PromptTemplateWithFields
): DPromptTemplate => {
   return {
      id: prompt.id,
      promptText: prompt.promptText,
      detailedDescription: prompt.detailedDescription,
      fields: toDTemplateFields(prompt.fields),
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
): DPromptTemplateField => ({
   id: field.id,
   promptTemplateId: field.promptTemplateId,
   name: field.name,
   label: field.label,
   description: field.description ?? undefined,
   type: field.type,
   required: field.required,
   order: field.order,
   defaultValue: field.defaultValue ?? undefined,
   options: field.options ? (field.options as string[]) : undefined,
});
