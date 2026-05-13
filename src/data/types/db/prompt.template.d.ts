import {
   Prompt,
   PromptCategory,
   PromptContent,
   PromptField,
   PromptGlobalField,
} from "@/generated/prisma/client";

export type PromptContentWithFields = PromptContent & {
   fields: PromptField[];
   globalFields: PromptGlobalField[];
};

export type PromptWithCategories = Prompt & {
   categories: PromptCategory[];
};

export type PromptWithTemplate = Prompt & {
   categories: PromptCategory[];
   promptContent: PromptContentWithFields;
};
