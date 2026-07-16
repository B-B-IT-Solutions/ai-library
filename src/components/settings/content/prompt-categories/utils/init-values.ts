import {
   DPromptCategoryUpdate,
   DPromptCategoryWithUsage,
} from "@/data/types/domain/prompt";

export const initPromptCategory = (
   category?: DPromptCategoryWithUsage
): DPromptCategoryUpdate => {
   return {
      name: category?.name ?? "",
   };
};
