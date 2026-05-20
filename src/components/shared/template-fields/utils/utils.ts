import { includes, map, upperCase } from "es-toolkit/compat";

import { DPromptVariableType } from "@/data/types/domain/prompt";

export const OPTIONS_FIELD_TYPES: DPromptVariableType[] = ["SELECT", "RADIO"];

export const TEMPLATE_FIELD_LABELS: Record<DPromptVariableType, string> = {
   TEXT: "Text",
   TEXTAREA: "Textarea",
   EMAIL: "E-Mail",
   NUMBER: "Nummer",
   DATE: "Datum",
   SELECT: "Auswahl",
   CHECKBOX: "Checkbox",
   RADIO: "Radio",
};

export const TEMPLATE_FIELD_OPTIONS = map(
   Object.entries(TEMPLATE_FIELD_LABELS),
   ([value, label]) => ({
      value,
      label,
   })
);

export const getTemplateFieldTypeLabel = (type: DPromptVariableType) => {
   const label = TEMPLATE_FIELD_LABELS[type] ?? type;
   return upperCase(label);
};

export const isOptionsFieldType = (type: DPromptVariableType) => {
   return includes(OPTIONS_FIELD_TYPES, type);
};
