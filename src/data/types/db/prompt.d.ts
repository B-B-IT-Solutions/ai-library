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

export type PromptWithRelations = PromptWithCategories & {
   fields: PromptField[];
   globalFields: PromptGlobalField[];
};

export type PromptWithContent = PromptWithRelations & {
   content: PromptContent;
};

export type PromptPreview = Pick<Prompt, "id" | "title">;
