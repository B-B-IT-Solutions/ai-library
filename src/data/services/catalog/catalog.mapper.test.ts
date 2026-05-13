import { dtestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   DCatalogEntryField,
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";
import {
   DPromptFieldUpdate,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

import {
   toPromptFieldUpdate,
   toPromptFieldUpdates,
   toPromptTemplateUpdate,
} from "./catalog.mapper";

const toPromptTemplateUpdateInternal = (
   entry: DCatalogEntryWithContent
): DPromptTemplateUpdate => {
   const fields = toPromptFieldUpdatesInternal(entry.fields);

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

const toPromptFieldUpdatesInternal = (
   fields: DCatalogEntryField[]
): DPromptFieldUpdate[] => {
   return map(fields, (f) => toPromptFieldUpdateInternal(f));
};

const toPromptFieldUpdateInternal = (
   field: DCatalogEntryField
): DPromptFieldUpdate => {
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

   it("toPromptFieldUpdates test", async () => {
      const fields = dtestData.dCatalogEntryFields();
      const result = toPromptFieldUpdates(fields);
      const expectedResult = toPromptFieldUpdatesInternal(fields);
      expect(result).toEqual(expectedResult);
   });

   it("toPromptFieldUpdate test", async () => {
      const field = dtestData.dCatalogEntryField();
      const result = toPromptFieldUpdate(field);
      const expectedResult = toPromptFieldUpdateInternal(field);
      expect(result).toEqual(expectedResult);
   });

   it("toPromptFieldUpdate - values null - test", async () => {
      const field = dtestData.dCatalogEntryField();
      field.description = null;
      field.defaultValue = null;

      const result = toPromptFieldUpdate(field);
      const expectedResult = toPromptFieldUpdateInternal(field);
      expect(result).toEqual(expectedResult);
   });
});
