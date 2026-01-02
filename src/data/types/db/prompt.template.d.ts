import {
   PromptTemplateCategory,
   PromptTemplateDescriptor,
} from "@/generated/prisma/client";

export type PromptTemplateDescriptorWithCategories =
   PromptTemplateDescriptor & {
      categories: PromptTemplateCategory[];
   };
