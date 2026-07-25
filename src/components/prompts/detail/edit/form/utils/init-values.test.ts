import { dtestData } from "@tests";
import { map } from "es-toolkit/compat";

import { DPromptUpdate, DPromptWithContent } from "@/data/types/domain/prompt";

import { initPromptTemplate } from "./init-values";

const expectedInitPromptTempalteExisting = (
   prompt: DPromptWithContent
): DPromptUpdate => {
   return {
      title: prompt.title,
      description: prompt.description,
      content: prompt.content,
      model: prompt.model,
      categories: prompt.categories.map((c) => c.name),
      fields: map(prompt.fields, (f) => ({
         name: f.name,
         label: f.label,
         description: f.description ?? "",
         type: f.type,
         required: f.required,
         order: f.order,
         defaultValue: f.defaultValue ?? "",
         options: f.options ?? [],
      })),
      globalFieldIds: prompt.globalFieldIds ?? [],
   };
};

const expectedInitPromptTempalteNew: DPromptUpdate = {
   title: "",
   description: "",
   content: "",

   model: "",
   categories: [],
   fields: [],
   globalFieldIds: [],
};

describe("initPromptTempalte tests", () => {
   it("initPromptTempalte - new entry test", () => {
      const initValue = initPromptTemplate();
      expect(initValue).toEqual(expectedInitPromptTempalteNew);
   });

   it("initPromptTempalte - existing entry test", () => {
      const prompt = dtestData.dPromptWithContent();
      const field = prompt.fields[0];
      field.description = null;
      field.defaultValue = null;
      field.options = undefined;
      const initValues = initPromptTemplate(prompt);
      const expectedValues = expectedInitPromptTempalteExisting(prompt);
      expect(initValues).toEqual(expectedValues);
   });
});
