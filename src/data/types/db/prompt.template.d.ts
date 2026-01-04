import {
   PromptTemplate,
   PromptTemplateCategory,
   PromptTemplateDescriptor,
} from "@/generated/prisma/client";

export type PromptTemplateDescriptorWithCategories =
   PromptTemplateDescriptor & {
      categories: PromptTemplateCategory[];
   };

export type PromptTemplateDescriptorWithPrompt = PromptTemplateDescriptor & {
   categories: PromptTemplateCategory[];
   promptTemplate: PromptTemplate;
};
