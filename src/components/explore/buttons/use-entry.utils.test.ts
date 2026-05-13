import { dtestData } from "@tests";

import { DCatalogEntryWithContent } from "@/data/types/domain/catalog";
import { DPrompt, DPromptGenerationData } from "@/data/types/domain/prompt";

import {
   toCatalogEntryDescriptor,
   toCatalogEntryTemplateData,
} from "./use-entry.utils";

const toCatalogEntryDescriptorInternal = (
   entry: DCatalogEntryWithContent
): DPrompt => {
   return {
      id: entry.id,
      title: entry.title,
      description: entry.description,
      recommendedModel: entry.recommendedModel,
      categories: entry.category ? [{ name: entry.category.name }] : [],
      isFavorite: false,
      updatedAt: entry.updatedAt,
      createdAt: entry.createdAt,
   };
};

const toCatalogEntryTemplateDataInternal = (
   entry: DCatalogEntryWithContent
): DPromptGenerationData => {
   return {
      template: {
         id: entry.id,
         content: entry.content,
         fields: entry.fields.map((f) => ({
            ...f,
            promptId: f.catalogEntryId,
         })),
         globalFieldIds: [],
         updatedAt: entry.updatedAt,
         createdAt: entry.createdAt,
      },
      allFields: entry.fields.map((f) => ({
         ...f,
         promptId: f.catalogEntryId,
      })),
   };
};

describe("utils tests", () => {
   it("toCatalogEntryDescriptor test", async () => {
      const entry1 = dtestData.dCatalogEntryWithContent();
      const result1 = toCatalogEntryDescriptor(entry1);
      const expectedResult1 = toCatalogEntryDescriptorInternal(entry1);
      expect(result1).toEqual(expectedResult1);

      const entry2 = dtestData.dCatalogEntryWithContent();
      entry2.category = null;
      const result2 = toCatalogEntryDescriptor(entry2);
      const expectedResult2 = toCatalogEntryDescriptorInternal(entry2);
      expect(result2).toEqual(expectedResult2);
   });

   it("toCatalogEntryTemplateData test", async () => {
      const entry = dtestData.dCatalogEntryWithContent();
      const result = toCatalogEntryTemplateData(entry);
      const expectedResult = toCatalogEntryTemplateDataInternal(entry);
      expect(result).toEqual(expectedResult);
   });
});
