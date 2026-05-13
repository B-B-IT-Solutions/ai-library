import { DCatalogEntryWithContent } from "@/data/types/domain/catalog";
import { DPrompt, DPromptGenerationData } from "@/data/types/domain/prompt";

export const toCatalogEntryDescriptor = (
   entry: DCatalogEntryWithContent
): DPrompt => {
   return {
      id: entry.id,
      title: entry.title,
      description: entry.description,
      recommendedModel: entry.recommendedModel,
      categories: entry.category ? [{ name: entry.category.name }] : [],
      isFavorite: false,
      updatedAt: entry.updatedAt,
      createdAt: entry.createdAt,
   };
};

export const toCatalogEntryTemplateData = (
   entry: DCatalogEntryWithContent
): DPromptGenerationData => {
   return {
      template: {
         id: entry.id,
         content: entry.content,
         fields: entry.fields.map((f) => ({
            ...f,
            promptId: f.catalogEntryId,
         })),
         globalFieldIds: [],
         updatedAt: entry.updatedAt,
         createdAt: entry.createdAt,
      },
      allFields: entry.fields.map((f) => ({
         ...f,
         promptId: f.catalogEntryId,
      })),
   };
};
