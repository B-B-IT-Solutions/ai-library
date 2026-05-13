import { map } from "es-toolkit/compat";

import {
   DCatalogEntryField,
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";
import { DPromptUpdate, DPromptUpdate } from "@/data/types/domain/prompt";

export const toPromptTemplateUpdate = (
   entry: DCatalogEntryWithContent
): DPromptUpdate => {
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
): DPromptUpdate[] => {
   return map(fields, (f) => toPromptFieldUpdate(f));
};

export const toPromptFieldUpdate = (
   field: DCatalogEntryField
): DPromptUpdate => {
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
