import { DPromptField, DPromptFieldUpdate } from "@/data/types/domain/prompt";
import {
   DGlobalPromptField,
   DGlobalPromptFieldUpdate,
} from "@/data/types/domain/settings";

export const globalPromptFieldInitValues = (
   field?: DGlobalPromptField
): DGlobalPromptFieldUpdate => {
   return field
      ? existingTemplateFieldInitValues(field)
      : newTemplateFieldInitValues(0);
};

export const newTemplateFieldInitValues = (
   order: number,
   name?: string,
   label?: string
): DGlobalPromptFieldUpdate | DPromptFieldUpdate => {
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

type TemplateFieldInitValuesFn = {
   (field: DGlobalPromptField): DGlobalPromptFieldUpdate;
   (field: DPromptField): DPromptUpdate;
};

export const existingTemplateFieldInitValues: TemplateFieldInitValuesFn = (
   field: DGlobalPromptField | DPromptField
): DGlobalPromptFieldUpdate | DPromptUpdate => {
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
};
