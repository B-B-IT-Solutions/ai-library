import { includes, map, upperCase } from "es-toolkit/compat";

import { DPromptVariableType } from "@/data/types/domain/prompt";

export const OPTIONS_PROMPT_VARIABLE_TYPES: DPromptVariableType[] = [
   "SELECT",
   "RADIO",
];

export const PROMPT_VARIABLE_LABELS: Record<DPromptVariableType, string> = {
   TEXT: "Text",
   TEXTAREA: "Textarea",
   EMAIL: "E-Mail",
   NUMBER: "Nummer",
   DATE: "Datum",
   SELECT: "Auswahl",
   CHECKBOX: "Checkbox",
   RADIO: "Radio",
};

export const PROMPT_VARIABLE_OPTIONS = map(
   Object.entries(PROMPT_VARIABLE_LABELS),
   ([value, label]) => ({
      value,
      label,
   })
);

export const getPromptVariableTypeLabel = (type: DPromptVariableType) => {
   const label = PROMPT_VARIABLE_LABELS[type] ?? type;
   return upperCase(label);
};

export const isOptionsPromptVariableType = (type: DPromptVariableType) => {
   return includes(OPTIONS_PROMPT_VARIABLE_TYPES, type);
};
