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

export type PromptCategoryWithUsage = Pick<PromptCategory, "id" | "name"> & {
   _count: { prompts: number };
};

export type PromptWithRelations = PromptWithCategories & {
   fields: PromptField[];
   globalFields: PromptGlobalField[];
};

export type PromptWithContent = PromptWithRelations & {
   content: PromptContent;
};

export type PromptPreview = Pick<Prompt, "id" | "title">;
