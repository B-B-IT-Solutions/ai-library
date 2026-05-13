import { map } from "es-toolkit/compat";

import {
   DCatalogEntryField,
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";
import {
   DPromptFieldUpdate,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

export const toPromptTemplateUpdate = (
   entry: DCatalogEntryWithContent
): DPromptTemplateUpdate => {
   const fields = toPromptFieldUpdates(entry.fields);

   return {
      title: entry.title,
      description: entry.description,
      content: entry.content,
      recommendedModel: entry.recommendedModel,
      categories: entry.category ? [entry.category.name] : [],
      fields,
      globalFieldIds: [],
   };
};

export const toPromptFieldUpdates = (
   fields: DCatalogEntryField[]
): DPromptFieldUpdate[] => {
   return map(fields, (f) => toPromptFieldUpdate(f));
};

export const toPromptFieldUpdate = (
   field: DCatalogEntryField
): DPromptFieldUpdate => {
   return {
      name: field.name,
      label: field.label,
      description: field.description ?? undefined,
      type: field.type,
      required: field.required,
      order: field.order,
      defaultValue: field.defaultValue ?? undefined,
      options: field.options,
   };
};
