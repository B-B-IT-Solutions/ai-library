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
   toDCatalogCategories,
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
   return map(entries, (e) => toDCatalogEntryWithContentInternal(e));
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
   return map(entries, (e) => toDCatalogEntryInternal(e));
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
      category: entry.category
         ? toDCatalogCategoryInternal(entry.category)
         : null,
      fields: map(entry.fields, toDCatalogEntryFieldInternal).sort(
         (a, b) => a.order - b.order
      ),
      copyCount: entry.copyCount,
      publishedAt: entry.publishedAt?.toISOString() ?? null,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
   };
};

export const toDCatalogCategoriesInternal = (
   cats: CatalogCategory[]
): DCatalogEntryCategory[] => {
   return map(cats, (c) => toDCatalogCategoryInternal(c));
};

const toDCatalogCategoryInternal = (
   cat: CatalogCategory
): DCatalogEntryCategory => {
   return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      order: cat.order,
   };
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
      const entry1 = ptestData.pCatalogEntryWithRelations();
      const result1 = toDCatalogEntry(entry1);
      const expectedResult1 = toDCatalogEntryInternal(entry1);
      expect(result1).toEqual(expectedResult1);

      const entry2 = ptestData.pCatalogEntryWithRelations();
      entry2.category = null;
      const result2 = toDCatalogEntry(entry2);
      const expectedResult2 = toDCatalogEntryInternal(entry2);
      expect(result2).toEqual(expectedResult2);
   });

   it("toDCatalogCategories test", async () => {
      const categories = ptestData.pCatalogCategories();
      const result = toDCatalogCategories(categories);
      const expectedResult = toDCatalogCategoriesInternal(categories);
      expect(result).toEqual(expectedResult);
   });

   it("toDCatalogCategory test", async () => {
      const category = ptestData.pCatalogCategory();
      const result = toDCatalogCategory(category);
      const expectedResult = toDCatalogCategoryInternal(category);
      expect(result).toEqual(expectedResult);
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
