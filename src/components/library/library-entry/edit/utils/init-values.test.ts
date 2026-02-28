import { dtestData } from "@tests";

import { DLibraryEntryWithPromptTemplate } from "@/data/types/domain/library";
import { DPromptTemplateUpdate } from "@/data/types/domain/prompt.template";

import { initPromptTempalte } from "./init-values";

const expectedInitPromptTempalteExisting = (
   entry: DLibraryEntryWithPromptTemplate
): DPromptTemplateUpdate => {
   const { templateDescriptor: descriptor } = entry;
   return {
      title: descriptor.title,
      description: descriptor.description,
      content: descriptor.promptTemplate.content,
      detailedDescription: descriptor.promptTemplate.detailedDescription,
      recommendedModel: descriptor.recommendedModel,
      categories: descriptor.categories.map((c) => c.name),
      categoryInput: "",
      fields: descriptor.promptTemplate.fields.map((f) => ({
         name: f.name,
         label: f.label,
         description: f.description ?? "",
         type: f.type,
         required: f.required,
         order: f.order,
         defaultValue: f.defaultValue ?? "",
         options: f.options ?? [],
      })),
   };
};

const expectedInitPromptTempalteNew: DPromptTemplateUpdate = {
   title: "",
   description: "",
   content: "",
   detailedDescription: "",
   recommendedModel: "Claude 3.5 Sonnet",
   categories: [],
   categoryInput: "",
   fields: [],
};

describe("initPromptTempalte tests", () => {
   it("initPromptTempalte - new entry test", () => {
      const initValue = initPromptTempalte();
      expect(initValue).toEqual(expectedInitPromptTempalteNew);
   });

   it("initPromptTempalte - existing entry test", () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();
      const field = entry.templateDescriptor.promptTemplate.fields[0];
      field.description = null;
      field.defaultValue = null;
      field.options = undefined;
      const initValues = initPromptTempalte(entry);
      const expectedValues = expectedInitPromptTempalteExisting(entry);
      expect(initValues).toEqual(expectedValues);
   });
});
