import {
   Prompt,
   PromptContent,
   PromptField,
   PromptGlobalField,
   PromptTemplateCategory,
} from "@/generated/prisma/client";

export type PromptContentWithFields = PromptContent & {
   fields: PromptField[];
   globalFields: PromptGlobalField[];
};

export type PromptWithCategories = Prompt & {
   categories: PromptTemplateCategory[];
};

export type PromptWithTemplate = Prompt & {
   categories: PromptTemplateCategory[];
   promptContent: PromptContentWithFields;
};
