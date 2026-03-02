import { DPromptTemplateFieldType } from "@/data/types/domain/prompt.template";

import {
   getTemplateFieldTypeLabel,
   TEMPLATE_FIELD_LABELS,
   TEMPLATE_FIELD_OPTIONS,
} from "./utils";

export const expecteTemplateFieldLabels: Record<
   DPromptTemplateFieldType,
   string
> = {
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
   it("TEMPLATE_FIELD_LABELS test", () => {
      expect(TEMPLATE_FIELD_LABELS).toEqual(expecteTemplateFieldLabels);
   });

   it("TEMPLATE_FIELD_OPTIONS test", () => {
      expect(TEMPLATE_FIELD_OPTIONS).toEqual(expectedTemplateFieldOptions);
   });

   it("getTemplateFieldTypeLabel - test", () => {
      const result1 = getTemplateFieldTypeLabel("TEXT");
      expect(result1).toEqual(expecteTemplateFieldLabels.TEXT);

      const result2 = getTemplateFieldTypeLabel("NUMBER");
      expect(result2).toEqual(expecteTemplateFieldLabels.NUMBER);

      const type = "UNKNOW" as DPromptTemplateFieldType;
      const result3 = getTemplateFieldTypeLabel(type);
      expect(result3).toEqual(type);
   });
});
