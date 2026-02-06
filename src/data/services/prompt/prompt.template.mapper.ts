import { map } from "es-toolkit/compat";

import {
   PromptTemplateDescriptorWithCategories,
   PromptTemplateDescriptorWithPrompt,
   PromptTemplateWithFields,
} from "@/data/types/db/prompt.template";
import { DbTemplateField } from "@/data/types/db/template.field";
import {
   DPromptTemplate,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithPrompt,
} from "@/data/types/domain/prompt.template";
import { DTemplateField } from "@/data/types/domain/template.field";
import { PromptTemplate } from "@/generated/prisma/client";

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

export const toDTemplateField = (field: DbTemplateField): DTemplateField => ({
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

export const toDTemplateFields = (
   fields: DbTemplateField[]
): DTemplateField[] => {
   return fields.map(toDTemplateField).sort((a, b) => a.order - b.order);
};
