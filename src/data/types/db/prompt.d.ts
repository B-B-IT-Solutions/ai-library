import {
   Prompt,
   PromptCategory,
   PromptContent,
   PromptField,
   PromptGlobalField,
} from "@/generated/prisma/client";

export type PromptWithFieldsAndContent = Prompt & {
   promptContent: PromptContent;
   fields: PromptField[];
   globalFields: PromptGlobalField[];
};

export type PromptWithCategories = Prompt & {
   categories: PromptCategory[];
};

export type PromptWithTemplate = Prompt & {
   categories: PromptCategory[];
   promptContent: PromptContent;
   fields: PromptField[];
   globalFields: PromptGlobalField[];
};
