import {
   PromptTemplate,
   PromptTemplateCategory,
} from "@/generated/prisma/client";

export type PromptTemplateWithCategories = PromptTemplate & {
   categories: PromptTemplateCategory[];
};
