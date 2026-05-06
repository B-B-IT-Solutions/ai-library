import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";

import {
   CatalogEntryWithContent,
   CatalogEntryWithRelations,
} from "@/data/types/db/catalog";
import {
   DCatalogEntry,
   DCatalogEntryCategory,
   DCatalogEntryField,
   DCatalogEntryWithContent,
} from "@/data/types/domain/catalog";
import { CatalogCategory, CatalogEntryField } from "@/generated/prisma/client";

import {
   toDCatalogCategory,
   toDCatalogEntries,
   toDCatalogEntriesWithContent,
   toDCatalogEntry,
   toDCatalogEntryField,
   toDCatalogEntryWithContent,
} from "./catalog.mapper";

export const toDCatalogEntriesWithContentInternal = (
   entries: CatalogEntryWithContent[]
): DCatalogEntryWithContent[] => {
   return map(entries, (e) => toDCatalogEntryWithContent(e));
};

export const toDCatalogEntryWithContentInternal = (
   entry: CatalogEntryWithContent
): DCatalogEntryWithContent => {
   return {
      ...toDCatalogEntryInternal(entry),
      content: entry.content.content,
   };
};

export const toDCatalogEntriesInternal = (
   entries: CatalogEntryWithRelations[]
): DCatalogEntry[] => {
   return map(entries, (e) => toDCatalogEntry(e));
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

describe("toDCatalogEntriesWithContent tests", () => {
   it("toDCatalogEntriesWithContent test", async () => {
      const entries = ptestData.pCatalogEntriesWithContent();
      const result = toDCatalogEntriesWithContent(entries);
      const expectedResult = toDCatalogEntriesWithContentInternal(entries);
      expect(result).toEqual(expectedResult);
   });

   it("toDCatalogEntryWithContent test", async () => {
      const entry = ptestData.pCatalogEntryWithContent();
      entry.publishedAt = null;
      const result = toDCatalogEntryWithContent(entry);
      const expectedResult = toDCatalogEntryWithContentInternal(entry);
      expect(result).toEqual(expectedResult);
   });
});

describe("toDCatalogEntries tests", () => {
   it("toDCatalogEntries", async () => {
      const entries = ptestData.pCatalogEntriesWithRelations();
      const result = toDCatalogEntries(entries);
      const expectedResult = toDCatalogEntriesInternal(entries);
      expect(result).toEqual(expectedResult);
   });

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
