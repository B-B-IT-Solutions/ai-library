import { dtestData } from "@tests";

import { DPromptTemplateField } from "@/data/types/domain/prompt.template";
import { DGlobalTemplateField } from "@/data/types/domain/settings";

import { existingTemplateFieldInitValues } from "./init-values";

const expectedExistingTemplateFieldInitValues = (
   field: DGlobalTemplateField | DPromptTemplateField
) => {
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

describe("initPromptTemplateField tests", () => {
   it("existingTemplateFieldInitValues - global template field - test", () => {
      const field1 = dtestData.dGlobalTemplateField();
      const result1 = existingTemplateFieldInitValues(field1);
      const expectedResult1 = expectedExistingTemplateFieldInitValues(field1);
      expect(result1).toEqual(expectedResult1);

      const field2 = dtestData.dGlobalTemplateField();
      field2.description = null;
      field2.defaultValue = null;
      field2.options = null;
      const result2 = existingTemplateFieldInitValues(field1);
      const expectedResult2 = expectedExistingTemplateFieldInitValues(field1);
      expect(result2).toEqual(expectedResult2);
   });

   it("existingTemplateFieldInitValues - prompt  template field - test", () => {
      const field1 = dtestData.dPromptTemplateField();
      const result1 = existingTemplateFieldInitValues(field1);
      const expectedResult1 = expectedExistingTemplateFieldInitValues(field1);
      expect(result1).toEqual(expectedResult1);

      const field2 = dtestData.dGlobalTemplateField();
      field2.description = null;
      field2.defaultValue = null;
      field2.options = null;
      const result2 = existingTemplateFieldInitValues(field1);
      const expectedResult2 = expectedExistingTemplateFieldInitValues(field1);
      expect(result2).toEqual(expectedResult2);
   });
});
