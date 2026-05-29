import { dtestData } from "@tests";

import { DPromptVariable } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";

import {
   existingTemplateFieldInitValues,
   globalPromptFieldInitValues,
   newTemplateFieldInitValues,
} from "./init-values";

const expectedExistingTemplateFieldInitValues = (
   field: DGlobalPromptField | DPromptVariable
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

describe("globalPromptFieldInitValues tests", () => {
   it("globalPromptFieldInitValues - new field init values - test", () => {
      const result = globalPromptFieldInitValues();
      const expectedResult = expectedNewTemplateFieldInitValues(0);
      expect(result).toEqual(expectedResult);
   });

   it("globalPromptFieldInitValues - existing field init values - test", () => {
      const field = dtestData.dGlobalPromptField();
      const result = globalPromptFieldInitValues(field);
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
      const field1 = dtestData.dGlobalPromptField();
      const result1 = existingTemplateFieldInitValues(field1);
      const expectedResult1 = expectedExistingTemplateFieldInitValues(field1);
      expect(result1).toEqual(expectedResult1);

      const field2 = dtestData.dGlobalPromptField();
      field2.description = null;
      field2.defaultValue = null;
      field2.options = undefined;
      const result2 = existingTemplateFieldInitValues(field1);
      const expectedResult2 = expectedExistingTemplateFieldInitValues(field1);
      expect(result2).toEqual(expectedResult2);
   });

   it("existingTemplateFieldInitValues - prompt  template field - test", () => {
      const variable1 = dtestData.dPromptVariable();
      const result1 = existingTemplateFieldInitValues(variable1);
      const expectedResult1 =
         expectedExistingTemplateFieldInitValues(variable1);
      expect(result1).toEqual(expectedResult1);

      const variable2 = dtestData.dGlobalPromptField();
      variable2.description = null;
      variable2.defaultValue = null;
      variable2.options = undefined;
      const result2 = existingTemplateFieldInitValues(variable1);
      const expectedResult2 =
         expectedExistingTemplateFieldInitValues(variable1);
      expect(result2).toEqual(expectedResult2);
   });
});
