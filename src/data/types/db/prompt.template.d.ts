import {
   PromptTemplate,
   PromptTemplateCategory,
   PromptTemplateDescriptor,
   PromptTemplateField,
} from "@/generated/prisma/client";

export type PromptTemplateWithFields = PromptTemplate & {
   fields: PromptTemplateField[];
};

export type PromptTemplateDescriptorWithCategories =
   PromptTemplateDescriptor & {
      categories: PromptTemplateCategory[];
   };

export type PromptTemplateDescriptorWithTemplate = PromptTemplateDescriptor & {
   categories: PromptTemplateCategory[];
   promptTemplate: PromptTemplateWithFields;
};
