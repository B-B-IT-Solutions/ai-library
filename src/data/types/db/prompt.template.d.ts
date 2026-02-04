import {
   PromptTemplate,
   PromptTemplateCategory,
   PromptTemplateDescriptor,
   TemplateField,
} from "@/generated/prisma/client";

export type PromptTemplateWithFields = PromptTemplate & {
   fields: TemplateField[];
};

export type PromptTemplateDescriptorWithCategories =
   PromptTemplateDescriptor & {
      categories: PromptTemplateCategory[];
   };

export type PromptTemplateDescriptorWithPrompt = PromptTemplateDescriptor & {
   categories: PromptTemplateCategory[];
   promptTemplate: PromptTemplateWithFields;
};
