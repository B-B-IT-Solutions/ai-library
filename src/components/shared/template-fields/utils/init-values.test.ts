import { dtestData } from "@tests";

import { DPromptTemplateField } from "@/data/types/domain/prompt.template";
import { DGlobalTemplateField } from "@/data/types/domain/settings";

import {
   existingTemplateFieldInitValues,
   globalTemplateFieldInitValues,
   newTemplateFieldInitValues,
} from "./init-values";

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

export const expectedNewTemplateFieldInitValues = (
   order: number,
   name?: string,
   label?: string
) => {
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

describe("globalTemplateFieldInitValues tests", () => {
   it("globalTemplateFieldInitValues - new field init values - test", () => {
      const result = globalTemplateFieldInitValues();
      const expectedResult = expectedNewTemplateFieldInitValues(0);
      expect(result).toEqual(expectedResult);
   });

   it("globalTemplateFieldInitValues - existing field init values - test", () => {
      const field = dtestData.dGlobalTemplateField();
      const result = globalTemplateFieldInitValues(field);
      const expectedResult = expectedExistingTemplateFieldInitValues(field);
      expect(result).toEqual(expectedResult);
   });
});

describe("newTemplateFieldInitValues tests", () => {
   it("newTemplateFieldInitValues test", () => {
      const result1 = newTemplateFieldInitValues(1);
      const expectedResult1 = expectedNewTemplateFieldInitValues(1);
      expect(result1).toEqual(expectedResult1);

      const name = "name-1";
      const label = "label-1";
      const result2 = newTemplateFieldInitValues(2, name, label);
      const expectedResult2 = expectedNewTemplateFieldInitValues(
         2,
         name,
         label
      );
      expect(result2).toEqual(expectedResult2);
   });
});

describe("existingTemplateFieldInitValues tests", () => {
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
