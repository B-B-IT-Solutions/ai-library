import { map } from "es-toolkit/compat";

import {
   DCatalogEntryField,
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";
import {
   DPromptTemplateFieldUpdate,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

export const toPromptTemplateUpdate = (
   entry: DCatalogEntryWithContent
): DPromptTemplateUpdate => {
   const fields = toPromptTemplateFieldUpdates(entry.fields);

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

export const toPromptTemplateFieldUpdates = (
   fields: DCatalogEntryField[]
): DPromptTemplateFieldUpdate[] => {
   return map(fields, (f) => toPromptTemplateFieldUpdate(f));
};

export const toPromptTemplateFieldUpdate = (
   field: DCatalogEntryField
): DPromptTemplateFieldUpdate => {
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
