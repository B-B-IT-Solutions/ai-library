import {
   PromptTemplate,
   PromptTemplateCategory,
   PromptTemplateDescriptor,
   PromptTemplateField,
   PromptTemplateGlobalField,
} from "@/generated/prisma/client";

export type PromptTemplateWithFields = PromptTemplate & {
   fields: PromptTemplateField[];
   globalFields: PromptTemplateGlobalField[];
};

export type PromptTemplateDescriptorWithCategories =
   PromptTemplateDescriptor & {
      categories: PromptTemplateCategory[];
   };

export type PromptTemplateDescriptorWithTemplate = PromptTemplateDescriptor & {
   categories: PromptTemplateCategory[];
   promptTemplate: PromptTemplateWithFields;
};
