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
   DTemplateField,
} from "@/data/types/domain/prompt.template";
import { PromptTemplate, TemplateField } from "@/generated/prisma/client";

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
   prompt: PromptTemplate | PromptTemplateWithFields
): DPromptTemplate => {
   return {
      id: prompt.id,
      promptText: prompt.promptText,
      detailedDescription: prompt.detailedDescription,
      fields: "fields" in prompt ? toDTemplateFields(prompt.fields) : [],
      updatedAt: prompt.updatedAt.toISOString(),
      createdAt: prompt.createdAt.toISOString(),
   };
};

export const toDTemplateFields = (
   fields: TemplateField[]
): DTemplateField[] => {
   return map(fields, toDTemplateField).sort((a, b) => a.order - b.order);
};

export const toDTemplateField = (field: TemplateField): DTemplateField => ({
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
   validation: field.validation
      ? (field.validation as Record<string, any>)
      : undefined,
});
