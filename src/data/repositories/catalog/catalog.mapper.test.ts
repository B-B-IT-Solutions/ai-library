import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import { CatalogEntryWithRelations } from "@/data/types/db/catalog";
import {
   DCatalogEntry,
   DCatalogEntryCategory,
   DCatalogEntryField,
   DCatalogEntrySummary,
} from "@/data/types/domain/catalog";
import { CatalogCategory, CatalogEntryField } from "@/generated/prisma/client";

import {
   toDCatalogCategory,
   toDCatalogEntry,
   toDCatalogEntryField,
   toDCatalogEntrySummaries,
   toDCatalogEntrySummary,
} from "./catalog.mapper";

export const toDCatalogEntrySummariesInternal = (
   entries: CatalogEntryWithRelations[]
): DCatalogEntrySummary[] => {
   return map(entries, (e) => toDCatalogEntrySummaryInternal(e));
};

export const toDCatalogEntrySummaryInternal = (
   entry: CatalogEntryWithRelations
): DCatalogEntrySummary => {
   const { content: _content, ...rest } = toDCatalogEntryInternal(entry);
   return rest;
};

export const toDCatalogEntryInternal = (
   entry: CatalogEntryWithRelations
): DCatalogEntry => {
   return {
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      description: entry.description,
      recommendedModel: entry.recommendedModel,
      content: entry.content,
      status: entry.status,
      category: toDCatalogCategoryInternal(entry.category),
      fields: map(entry.fields, toDCatalogEntryFieldInternal).sort(
         (a, b) => a.order - b.order
      ),
      copyCount: entry.copyCount,
      publishedAt: entry.publishedAt?.toISOString() ?? null,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
   };
};

const toDCatalogCategoryInternal = (
   cat: CatalogCategory | null
): DCatalogEntryCategory | null => {
   if (cat) {
      return {
         id: cat.id,
         name: cat.name,
         slug: cat.slug,
         description: cat.description,
         order: cat.order,
      };
   }
   return null;
};

const toDCatalogEntryFieldInternal = (
   field: CatalogEntryField
): DCatalogEntryField => {
   return {
      id: field.id,
      catalogEntryId: field.catalogEntryId,
      name: field.name,
      label: field.label,
      description: field.description,
      type: field.type,
      required: field.required,
      order: field.order,
      defaultValue: field.defaultValue,
      options: field.options as string[] | undefined,
   };
};

describe("toDCatalogEntrySummaries tests", () => {
   it("toDCatalogEntrySummaries test", async () => {
      const entries = ptestData.pCatalogEntriesWithRelations();
      const result = toDCatalogEntrySummaries(entries);
      const expectedResult = toDCatalogEntrySummariesInternal(entries);
      expect(result).toEqual(expectedResult);
   });

   it("toDCatalogEntrySummary test", async () => {
      const entry = ptestData.pCatalogEntryWithRelations();
      entry.publishedAt = null;
      const result = toDCatalogEntrySummary(entry);
      const expectedResult = toDCatalogEntrySummaryInternal(entry);
      expect(result).toEqual(expectedResult);
   });
});

describe("toDCatalogEntry tests", () => {
   it("toDCatalogEntry test", async () => {
      const entry = ptestData.pCatalogEntryWithRelations();
      const result = toDCatalogEntry(entry);
      const expectedResult = toDCatalogEntryInternal(entry);
      expect(result).toEqual(expectedResult);
   });

   it("toDCatalogCategory test", async () => {
      const category = ptestData.pCatalogCategory();
      const result1 = toDCatalogCategory(category);
      const expectedResult1 = toDCatalogCategoryInternal(category);
      expect(result1).toEqual(expectedResult1);

      const result2 = toDCatalogCategory(null);
      const expectedResult2 = toDCatalogCategoryInternal(null);
      expect(result2).toEqual(expectedResult2);
   });

   it("toDCatalogEntryField test", async () => {
      const field1 = ptestData.pCatalogEntryField();
      const result1 = toDCatalogEntryField(field1);
      const expectedResult1 = toDCatalogEntryFieldInternal(field1);
      expect(result1).toEqual(expectedResult1);

      const field2 = ptestData.pCatalogEntryField();
      field2.options = null;
      const result2 = toDCatalogEntryField(field1);
      const expectedResult2 = toDCatalogEntryFieldInternal(field1);
      expect(result2).toEqual(expectedResult2);
   });
});
