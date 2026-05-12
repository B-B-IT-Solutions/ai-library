import {
   Prompt,
   PromptContent,
   PromptTemplateCategory,
   PromptTemplateField,
   PromptTemplateGlobalField,
} from "@/generated/prisma/client";

export type PromptContentWithFields = PromptContent & {
   fields: PromptTemplateField[];
   globalFields: PromptTemplateGlobalField[];
};

export type PromptWithCategories = Prompt & {
   categories: PromptTemplateCategory[];
};

export type PromptWithTemplate = Prompt & {
   categories: PromptTemplateCategory[];
   promptContent: PromptContentWithFields;
};
