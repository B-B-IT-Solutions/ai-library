import { dtestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   DPrompt,
   DPromptWithContent,
   DPromptUpdate,
} from "@/data/types/domain/prompt";

import { initPromptTemplate } from "./init-values";

const expectedInitPromptTempalteExisting = (
   descriptor: DPrompt,
   template: DPromptWithContent
): DPromptUpdate => {
   return {
      title: descriptor.title,
      description: descriptor.description,
      content: template.content,
      recommendedModel: descriptor.recommendedModel,
      categories: descriptor.categories.map((c) => c.name),
      fields: map(template.fields, (f) => ({
         name: f.name,
         label: f.label,
         description: f.description ?? "",
         type: f.type,
         required: f.required,
         order: f.order,
         defaultValue: f.defaultValue ?? "",
         options: f.options ?? [],
      })),
      globalFieldIds: template.globalFieldIds ?? [],
   };
};

const expectedInitPromptTempalteNew: DPromptUpdate = {
   title: "",
   description: "",
   content: "",

   recommendedModel: "Claude",
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
      const descriptor = dtestData.dPromptTemplateDescriptor();
      const template = dtestData.dPromptTemplate();
      const field = template.fields[0];
      field.description = null;
      field.defaultValue = null;
      field.options = undefined;
      const initValues = initPromptTemplate(descriptor, template);
      const expectedValues = expectedInitPromptTempalteExisting(
         descriptor,
         template
      );
      expect(initValues).toEqual(expectedValues);
   });
});
