import { DCatalogEntryWithContent } from "@/data/types/domain/catalog";
import { DPrompt, DPromptGenerationData } from "@/data/types/domain/prompt";

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

export const toDPromptGenerationData = (
   entry: DCatalogEntryWithContent
): DPromptGenerationData => {
   return {
      template: {
         ...toDPrompt(entry),
         content: entry.content,
         fields: entry.fields.map((f) => ({
            ...f,
            promptId: f.catalogEntryId,
         })),
      },
      allFields: entry.fields.map((f) => ({
         ...f,
         promptId: f.catalogEntryId,
      })),
   };
};
