import {
   DPromptTemplateField,
   DPromptTemplateFieldUpdate,
} from "@/data/types/domain/prompt.template";
import {
   DGlobalTemplateField,
   DGlobalTemplateFieldUpdate,
} from "@/data/types/domain/settings";

export const globalTemplateFieldInitValues = (
   field?: DGlobalTemplateField
): DGlobalTemplateFieldUpdate => {
   return field
      ? existingTemplateFieldInitValues(field)
      : newTemplateFieldInitValues(0);
};

export const newTemplateFieldInitValues = (
   order: number,
   name?: string,
   label?: string
): DGlobalTemplateFieldUpdate | DPromptTemplateFieldUpdate => {
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
   (field: DGlobalTemplateField): DGlobalTemplateFieldUpdate;
   (field: DPromptTemplateField): DPromptTemplateFieldUpdate;
};

export const existingTemplateFieldInitValues: TemplateFieldInitValuesFn = (
   field: DGlobalTemplateField | DPromptTemplateField
): DGlobalTemplateFieldUpdate | DPromptTemplateFieldUpdate => {
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
