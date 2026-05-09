import { DCatalogEntryWithContent } from "@/data/types/domain/catalog";
import {
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateDescriptor,
} from "@/data/types/domain/prompt.template";

export const toCatalogEntryDescriptor = (
   entry: DCatalogEntryWithContent
): DPromptTemplateDescriptor => {
   return {
      id: entry.id,
      title: entry.title,
      description: entry.description,
      recommendedModel: entry.recommendedModel,
      categories: entry.category ? [{ name: entry.category.name }] : [],
      promptTemplateId: entry.id,
      isFavorite: false,
      updatedAt: entry.updatedAt,
      createdAt: entry.createdAt,
   };
};

export const toCatalogEntryTemplateData = (
   entry: DCatalogEntryWithContent
): DPromptTemplateDataPromptGeneration => {
   return {
      template: {
         id: entry.id,
         content: entry.content,
         fields: entry.fields.map((f) => ({
            ...f,
            promptTemplateId: f.catalogEntryId,
         })),
         globalFieldIds: [],
         updatedAt: entry.updatedAt,
         createdAt: entry.createdAt,
      },
      allFields: entry.fields.map((f) => ({
         ...f,
         promptTemplateId: f.catalogEntryId,
      })),
   };
};
