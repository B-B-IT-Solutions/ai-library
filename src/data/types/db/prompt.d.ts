import {
   Prompt,
   PromptCategory,
   PromptContent,
   PromptField,
   PromptGlobalField,
} from "@/generated/prisma/client";

export type PromptWithCategories = Prompt & {
   categories: PromptCategory[];
};

export type PromptWithRelations = Prompt & {
   categories: PromptCategory[];
   fields: PromptField[];
   globalFields: PromptGlobalField[];
};

export type PromptWithContent = PromptWithRelations & {
   content: PromptContent;
};
