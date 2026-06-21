import { dtestData } from "@tests";

import { DCatalogEntryWithContent } from "@/data/types/domain/catalog";
import { DPrompt, DPromptTemplatingData } from "@/data/types/domain/prompt";

import { toDPrompt, toDPromptGenerationData } from "./use-entry.utils";

const toDPromptInternal = (entry: DCatalogEntryWithContent): DPrompt => {
   return {
      id: entry.id,
      title: entry.title,
      description: entry.description,
      recommendedModel: entry.recommendedModel,
      categories: entry.category ? [{ name: entry.category.name }] : [],
      fields: [],
      globalFieldIds: [],
      isFavorite: false,
      updatedAt: entry.updatedAt,
      createdAt: entry.createdAt,
   };
};

const toDPromptGenerationDataInternal = (
   entry: DCatalogEntryWithContent
): DPromptTemplatingData => {
   return {
      prompt: {
         ...toDPrompt(entry),
         content: entry.content,
         fields: entry.fields.map((f) => ({
            ...f,
            promptId: f.catalogEntryId,
         })),
      },
      allFields: entry.fields.map((f) => ({
         ...f,
         promptId: f.catalogEntryId,
      })),
   };
};

describe("utils tests", () => {
   it("toDPrompt test", async () => {
      const entry1 = dtestData.dCatalogEntryWithContent();
      const result1 = toDPrompt(entry1);
      const expectedResult1 = toDPromptInternal(entry1);
      expect(result1).toEqual(expectedResult1);

      const entry2 = dtestData.dCatalogEntryWithContent();
      entry2.category = null;
      const result2 = toDPrompt(entry2);
      const expectedResult2 = toDPromptInternal(entry2);
      expect(result2).toEqual(expectedResult2);
   });

   it("toDPromptGenerationData test", async () => {
      const entry = dtestData.dCatalogEntryWithContent();
      const result = toDPromptGenerationData(entry);
      const expectedResult = toDPromptGenerationDataInternal(entry);
      expect(result).toEqual(expectedResult);
   });
});
