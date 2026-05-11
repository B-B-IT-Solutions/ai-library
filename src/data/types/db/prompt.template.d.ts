import {
   PromptContent,
   PromptTemplateCategory,
   PromptTemplateDescriptor,
   PromptTemplateField,
   PromptTemplateGlobalField,
} from "@/generated/prisma/client";

export type PromptContentWithFields = PromptContent & {
   fields: PromptTemplateField[];
   globalFields: PromptTemplateGlobalField[];
};

export type PromptTemplateDescriptorWithCategories =
   PromptTemplateDescriptor & {
      categories: PromptTemplateCategory[];
   };

export type PromptTemplateDescriptorWithTemplate = PromptTemplateDescriptor & {
   categories: PromptTemplateCategory[];
   promptContent: PromptContentWithFields;
};
