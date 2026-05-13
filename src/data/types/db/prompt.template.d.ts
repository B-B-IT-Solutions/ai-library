import {
   Prompt,
   PromptContent,
   PromptGlobalField,
   PromptTemplateCategory,
   PromptTemplateField,
} from "@/generated/prisma/client";

export type PromptContentWithFields = PromptContent & {
   fields: PromptTemplateField[];
   globalFields: PromptGlobalField[];
};

export type PromptWithCategories = Prompt & {
   categories: PromptTemplateCategory[];
};

export type PromptWithTemplate = Prompt & {
   categories: PromptTemplateCategory[];
   promptContent: PromptContentWithFields;
};
