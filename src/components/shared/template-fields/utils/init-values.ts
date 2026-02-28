import { map } from "es-toolkit/compat";

import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import {
   DPromptTemplateField,
   DPromptTemplateFieldUpdate,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";
import {
   DGlobalTemplateField,
   DGlobalTemplateFieldUpdate,
} from "@/data/types/domain/settings";

export function existingTemplateFieldInitValues(
   field: DGlobalTemplateField
): DGlobalTemplateFieldUpdate;

export function existingTemplateFieldInitValues(
   field: DPromptTemplateField
): DPromptTemplateUpdate;

export function existingTemplateFieldInitValues(
   field: DGlobalTemplateField | DPromptTemplateField
): DGlobalTemplateFieldUpdate | DPromptTemplateUpdate {
   return {
      name: field.name,
      label: field.label,
      description: field.description ?? "",
      type: field.type,
      required: field.required,
      defaultValue: field.defaultValue ?? "",
      options: field.options ?? [],
      order: field.order,
   };
}

export const initPromptTemplateField = (
   order: number,
   name?: string,
   label?: string
): DPromptTemplateFieldUpdate => {
   return {
      name: name || "",
      label: label || "",
      description: "",
      type: "TEXT",
      required: true,
      order: order,
      defaultValue: "",
      options: [],
   };
};

export const initPromptTempalte = (
   entry?: DLibraryEntryWithPromptTemplate
): DPromptTemplateUpdate => {
   const { templateDescriptor: descriptor } = entry || {};
   const { promptTemplate } = descriptor || {};
   return {
      title: descriptor?.title ?? "",
      description: descriptor?.description ?? "",
      content: promptTemplate?.content ?? "",
      detailedDescription: promptTemplate?.detailedDescription ?? "",
      recommendedModel: descriptor?.recommendedModel ?? "Claude 3.5 Sonnet",
      categories: map(descriptor?.categories, "name"),
      categoryInput: "",
      fields: map(promptTemplate?.fields, (f) => ({
         name: f.name,
         label: f.label,
         description: f.description ?? "",
         type: f.type,
         required: f.required,
         order: f.order,
         defaultValue: f.defaultValue ?? "",
         options: f.options ?? [],
      })),
   };
};
