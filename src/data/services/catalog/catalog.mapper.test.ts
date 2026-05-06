import { dtestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   DCatalogEntryField,
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";
import {
   DPromptTemplateFieldUpdate,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

import {
   toPromptTemplateFieldUpdate,
   toPromptTemplateFieldUpdates,
   toPromptTemplateUpdate,
} from "./catalog.mapper";

const toPromptTemplateUpdateInternal = (
   entry: DCatalogEntryWithContent
): DPromptTemplateUpdate => {
   const fields = toPromptTemplateFieldUpdatesInternal(entry.fields);

   return {
      title: entry.title,
      description: entry.description,
      content: entry.content,
      recommendedModel: entry.recommendedModel,
      categories: entry.category ? [entry.category.name] : [],
      fields,
      globalFieldIds: [],
   };
};

const toPromptTemplateFieldUpdatesInternal = (
   fields: DCatalogEntryField[]
): DPromptTemplateFieldUpdate[] => {
   return map(fields, (f) => toPromptTemplateFieldUpdateInternal(f));
};

const toPromptTemplateFieldUpdateInternal = (
   field: DCatalogEntryField
): DPromptTemplateFieldUpdate => {
   return {
      name: field.name,
      label: field.label,
      description: field.description ?? undefined,
      type: field.type,
      required: field.required,
      order: field.order,
      defaultValue: field.defaultValue ?? undefined,
      options: field.options,
   };
};

describe("toPromptTemplateUpdate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toPromptTemplateUpdate test", async () => {
      const entry = dtestData.dCatalogEntryWithContent();
      const result = toPromptTemplateUpdate(entry);
      const expectedResult = toPromptTemplateUpdateInternal(entry);
      expect(result).toEqual(expectedResult);
   });

   it("toPromptTemplateUpdate - category null - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent();
      entry.category = null;

      const result = toPromptTemplateUpdate(entry);
      const expectedResult = toPromptTemplateUpdateInternal(entry);
      expect(result).toEqual(expectedResult);
   });

   it("toPromptTemplateFieldUpdates test", async () => {
      const fields = dtestData.dCatalogEntryFields();
      const result = toPromptTemplateFieldUpdates(fields);
      const expectedResult = toPromptTemplateFieldUpdatesInternal(fields);
      expect(result).toEqual(expectedResult);
   });

   it("toPromptTemplateFieldUpdate test", async () => {
      const field = dtestData.dCatalogEntryField();
      const result = toPromptTemplateFieldUpdate(field);
      const expectedResult = toPromptTemplateFieldUpdateInternal(field);
      expect(result).toEqual(expectedResult);
   });

   it("toPromptTemplateFieldUpdate - values null - test", async () => {
      const field = dtestData.dCatalogEntryField();
      field.description = null;
      field.defaultValue = null;

      const result = toPromptTemplateFieldUpdate(field);
      const expectedResult = toPromptTemplateFieldUpdateInternal(field);
      expect(result).toEqual(expectedResult);
   });
});
