import { DCatalogEntryWithContent } from "@/data/types/domain/catalog";
import { DPrompt, DPromptTemplatingData } from "@/data/types/domain/prompt";

export const toDPrompt = (entry: DCatalogEntryWithContent): DPrompt => {
   return {
      id: entry.id,
      title: entry.title,
      description: entry.description,
      recommendedModel: entry.recommendedModel,
      categories: entry.category ? [{ name: entry.category.name }] : [],
      fields: [],
      globalFieldIds: [],
      isFavorite: false,
      updatedAt: entry.updatedAt,
      createdAt: entry.createdAt,
   };
};

export const toDPromptTemplatingData = (
   entry: DCatalogEntryWithContent
): DPromptTemplatingData => {
   return {
      prompt: {
         ...toDPrompt(entry),
         content: entry.content,
         fields: entry.fields.map((f) => ({
            ...f,
            promptId: f.catalogEntryId,
         })),
      },
      allVariables: entry.fields.map((f) => ({
         ...f,
         promptId: f.catalogEntryId,
      })),
   };
};
