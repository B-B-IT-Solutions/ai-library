import { map } from "es-toolkit/compat";

import { DCatalogEntry } from "@/data/types/domain/catalog";
import {
   DPromptTemplateFieldUpdate,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

export const catalogEntryToPromptTemplateUpdate = (
   entry: DCatalogEntry
): DPromptTemplateUpdate => {
   const fields: DPromptTemplateFieldUpdate[] = map(entry.fields, (f) => ({
      name: f.name,
      label: f.label,
      description: f.description ?? undefined,
      type: f.type,
      required: f.required,
      order: f.order,
      defaultValue: f.defaultValue ?? undefined,
      options: f.options,
   }));

   const templateData: DPromptTemplateUpdate = {
      title: entry.title,
      description: entry.description,
      content: entry.content,
      recommendedModel: entry.recommendedModel,
      categories: entry.category ? [entry.category.name] : [],
      fields,
      globalFieldIds: [],
   };

   return templateData;
};
