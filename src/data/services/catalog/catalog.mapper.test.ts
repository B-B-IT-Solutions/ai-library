import { dtestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   DCatalogEntryField,
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";
import {
   DPromptUpdate,
   DPromptVariableUpdate,
} from "@/data/types/domain/prompt";

import {
   toPromptFieldUpdate,
   toPromptFieldUpdates,
   toPromptUpdate,
} from "./catalog.mapper";

const toPromptUpdateInternal = (
   entry: DCatalogEntryWithContent
): DPromptUpdate => {
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
): DPromptVariableUpdate[] => {
   return map(fields, (f) => toPromptFieldUpdateInternal(f));
};

const toPromptFieldUpdateInternal = (
   field: DCatalogEntryField
): DPromptVariableUpdate => {
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

describe("toPromptUpdate tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toPromptUpdate test", async () => {
      const entry = dtestData.dCatalogEntryWithContent();
      const result = toPromptUpdate(entry);
      const expectedResult = toPromptUpdateInternal(entry);
      expect(result).toEqual(expectedResult);
   });

   it("toPromptUpdate - category null - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent();
      entry.category = null;

      const result = toPromptUpdate(entry);
      const expectedResult = toPromptUpdateInternal(entry);
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
