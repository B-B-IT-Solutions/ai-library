import { upperCase } from "es-toolkit/compat";

import { DPromptTemplateFieldType } from "@/data/types/domain/prompt.template";

import {
   getTemplateFieldTypeLabel,
   isOptionsFieldType,
   OPTIONS_FIELD_TYPES,
   TEMPLATE_FIELD_LABELS,
   TEMPLATE_FIELD_OPTIONS,
} from "./utils";

const expectedOptionFieldTypes: DPromptTemplateFieldType[] = [
   "SELECT",
   "RADIO",
];

const expecteTemplateFieldLabels: Record<DPromptTemplateFieldType, string> = {
   TEXT: "Text",
   TEXTAREA: "Textarea",
   EMAIL: "E-Mail",
   NUMBER: "Nummer",
   DATE: "Datum",
   SELECT: "Auswahl",
   CHECKBOX: "Checkbox",
   RADIO: "Radio",
};

const expectedTemplateFieldOptions = [
   { value: "TEXT", label: "Text" },
   { value: "TEXTAREA", label: "Textarea" },
   { value: "EMAIL", label: "E-Mail" },
   { value: "NUMBER", label: "Nummer" },
   { value: "DATE", label: "Datum" },
   { value: "SELECT", label: "Auswahl" },
   { value: "CHECKBOX", label: "Checkbox" },
   { value: "RADIO", label: "Radio" },
];

describe("template field type tests", () => {
   it("OPTION_FIEDL_TYPES test", () => {
      expect(OPTIONS_FIELD_TYPES).toEqual(expectedOptionFieldTypes);
   });

   it("TEMPLATE_FIELD_LABELS test", () => {
      expect(TEMPLATE_FIELD_LABELS).toEqual(expecteTemplateFieldLabels);
   });

   it("TEMPLATE_FIELD_OPTIONS test", () => {
      expect(TEMPLATE_FIELD_OPTIONS).toEqual(expectedTemplateFieldOptions);
   });

   it("getTemplateFieldTypeLabel - test", () => {
      const result1 = getTemplateFieldTypeLabel("TEXT");
      const expectedResult1 = upperCase(expecteTemplateFieldLabels.TEXT);
      expect(result1).toEqual(expectedResult1);

      const result2 = getTemplateFieldTypeLabel("NUMBER");
      const expectedResult2 = upperCase(expecteTemplateFieldLabels.NUMBER);
      expect(result2).toEqual(expectedResult2);

      const type = "UNKNOW" as DPromptTemplateFieldType;
      const result3 = getTemplateFieldTypeLabel(type);
      expect(result3).toEqual(type);
   });

   it("isOptionsFieldType - test", () => {
      expect(isOptionsFieldType("TEXT")).toEqual(false);
      expect(isOptionsFieldType("NUMBER")).toEqual(false);
      expect(isOptionsFieldType("EMAIL")).toEqual(false);
      expect(isOptionsFieldType("SELECT")).toEqual(true);
      expect(isOptionsFieldType("RADIO")).toEqual(true);
   });
});
