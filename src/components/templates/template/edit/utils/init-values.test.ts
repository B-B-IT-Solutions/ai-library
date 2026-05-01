import { dtestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   DPromptTemplateDescriptor,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

import { initPromptTemplate } from "./init-values";

const expectedInitPromptTempalteExisting = (
   descriptor: DPromptTemplateDescriptor
): DPromptTemplateUpdate => {
   const { promptTemplate } = descriptor;
   return {
      title: descriptor.title,
      description: descriptor.description,
      content: descriptor.promptTemplate.content,
      recommendedModel: descriptor.recommendedModel,
      categories: descriptor.categories.map((c) => c.name),
      fields: map(promptTemplate.fields, (f) => ({
         name: f.name,
         label: f.label,
         description: f.description ?? "",
         type: f.type,
         required: f.required,
         order: f.order,
         defaultValue: f.defaultValue ?? "",
         options: f.options ?? [],
      })),
      globalFieldIds: promptTemplate.globalFieldIds ?? [],
   };
};

const expectedInitPromptTempalteNew: DPromptTemplateUpdate = {
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
      const field = descriptor.promptTemplate.fields[0];
      field.description = null;
      field.defaultValue = null;
      field.options = undefined;
      const initValues = initPromptTemplate(descriptor);
      const expectedValues = expectedInitPromptTempalteExisting(descriptor);
      expect(initValues).toEqual(expectedValues);
   });
});
