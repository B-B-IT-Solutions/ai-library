import { DPromptTemplateFieldType } from "@/data/types/domain/prompt.template";

export const TEMPLATE_FIELD_LABELS: Record<DPromptTemplateFieldType, string> = {
   TEXT: "Text",
   TEXTAREA: "Textarea",
   EMAIL: "E-Mail",
   NUMBER: "Nummer",
   DATE: "Datum",
   SELECT: "Auswahl",
   CHECKBOX: "Checkbox",
   RADIO: "Radio",
};

export const TEMPLATE_FIELD_OPTIONS = Object.entries(TEMPLATE_FIELD_LABELS).map(
   ([value, label]) => ({
      value,
      label,
   })
);

export const getFieldTypeLabel = (type: DPromptTemplateFieldType) => {
   return TEMPLATE_FIELD_LABELS[type] ?? type;
};
