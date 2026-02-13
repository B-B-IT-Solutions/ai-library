import {
   DPromptTemplateFieldUpdate,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

import { initPromptTempalte, initPromptTemplateField } from "./initValues";

export const expectedInitPromptTempalte: DPromptTemplateUpdate = {
   title: "",
   description: "",
   content: "",
   detailedDescription: "",
   recommendedModel: "Claude 3.5 Sonnet",
   categories: [],
   categoryInput: "",
   fields: [],
};

export const expectedInitPromptTemplateField: DPromptTemplateFieldUpdate = {
   name: "",
   label: "",
   description: "",
   type: "TEXT",
   required: true,
   order: 0,
   defaultValue: "",
   options: [],
};

describe("initPromptTempalte tests", () => {
   it("initPromptTempalte test", () => {
      const initValue = initPromptTempalte();
      expect(initValue).toEqual(expectedInitPromptTempalte);
   });
});

describe("initPromptTemplateField tests", () => {
   it("initPromptTemplateField - order - test", () => {
      const order = 5;
      const initValue = initPromptTemplateField(order);
      const expectedValue = {
         ...expectedInitPromptTemplateField,
         order,
      };

      expect(initValue).toEqual(expectedValue);
   });

   it("initPromptTemplateField - name - label - test", () => {
      const order = 5;
      const name = "name-1";
      const label = "Label 1";

      const initValue = initPromptTemplateField(order, name, label);
      const expectedValue = {
         ...expectedInitPromptTemplateField,
         order,
         name,
         label,
      };
      expect(initValue).toEqual(expectedValue);
   });
});
