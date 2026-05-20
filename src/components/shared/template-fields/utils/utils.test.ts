import { upperCase } from "es-toolkit/compat";

import { DPromptVariableType } from "@/data/types/domain/prompt";

import {
   getPromptVariableTypeLabel,
   isOptionsPromptVariableType,
   OPTIONS_PROMPT_VARIABLE_TYPES,
   PROMPT_VARIABLE_LABELS,
   PROMPT_VARIABLE_OPTIONS,
} from "./utils";

const expectedOptionPromptVariableTypes: DPromptVariableType[] = [
   "SELECT",
   "RADIO",
];

const expectePromptVariableLabels: Record<DPromptVariableType, string> = {
   TEXT: "Text",
   TEXTAREA: "Textarea",
   EMAIL: "E-Mail",
   NUMBER: "Nummer",
   DATE: "Datum",
   SELECT: "Auswahl",
   CHECKBOX: "Checkbox",
   RADIO: "Radio",
};

const expectedPromptVariableOptions = [
   { value: "TEXT", label: "Text" },
   { value: "TEXTAREA", label: "Textarea" },
   { value: "EMAIL", label: "E-Mail" },
   { value: "NUMBER", label: "Nummer" },
   { value: "DATE", label: "Datum" },
   { value: "SELECT", label: "Auswahl" },
   { value: "CHECKBOX", label: "Checkbox" },
   { value: "RADIO", label: "Radio" },
];

describe("prompt variable type tests", () => {
   it("OPTIONS_PROMPT_VARIABLE_TYPES test", () => {
      expect(OPTIONS_PROMPT_VARIABLE_TYPES).toEqual(
         expectedOptionPromptVariableTypes
      );
   });

   it("PROMPT_VARIABLE_LABELS test", () => {
      expect(PROMPT_VARIABLE_LABELS).toEqual(expectePromptVariableLabels);
   });

   it("PROMPT_VARIABLE_OPTIONS test", () => {
      expect(PROMPT_VARIABLE_OPTIONS).toEqual(expectedPromptVariableOptions);
   });

   it("getPromptVariableTypeLabel - test", () => {
      const result1 = getPromptVariableTypeLabel("TEXT");
      const expectedResult1 = upperCase(expectePromptVariableLabels.TEXT);
      expect(result1).toEqual(expectedResult1);

      const result2 = getPromptVariableTypeLabel("NUMBER");
      const expectedResult2 = upperCase(expectePromptVariableLabels.NUMBER);
      expect(result2).toEqual(expectedResult2);

      const type = "UNKNOW" as DPromptVariableType;
      const result3 = getPromptVariableTypeLabel(type);
      expect(result3).toEqual(type);
   });

   it("isOptionsPromptVariableType - test", () => {
      expect(isOptionsPromptVariableType("TEXT")).toEqual(false);
      expect(isOptionsPromptVariableType("NUMBER")).toEqual(false);
      expect(isOptionsPromptVariableType("EMAIL")).toEqual(false);
      expect(isOptionsPromptVariableType("SELECT")).toEqual(true);
      expect(isOptionsPromptVariableType("RADIO")).toEqual(true);
   });
});
