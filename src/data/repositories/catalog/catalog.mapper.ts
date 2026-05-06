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

export const toDCatalogEntriesWithContent = (
   entries: CatalogEntryWithContent[]
): DCatalogEntryWithContent[] => {
   return map(entries, (e) => toDCatalogEntryWithContent(e));
};

export const toDCatalogEntryWithContent = (
   entry: CatalogEntryWithContent
): DCatalogEntryWithContent => {
   return {
      ...toDCatalogEntry(entry),
      content: entry.content.content,
   };
};

export const toDCatalogEntries = (
   entries: CatalogEntryWithRelations[]
): DCatalogEntry[] => {
   return map(entries, (e) => toDCatalogEntry(e));
};

export const toDCatalogEntry = (
   entry: CatalogEntryWithRelations
): DCatalogEntry => {
   return {
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      description: entry.description,
      recommendedModel: entry.recommendedModel,
      status: entry.status,
      category: entry.category ? toDCatalogCategory(entry.category) : null,
      fields: map(entry.fields, toDCatalogEntryField).sort(
         (a, b) => a.order - b.order
      ),
      copyCount: entry.copyCount,
      publishedAt: entry.publishedAt?.toISOString() ?? null,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
   };
};

export const toDCatalogCategories = (
   cats: CatalogCategory[]
): DCatalogEntryCategory[] => {
   return map(cats, (c) => toDCatalogCategory(c));
};

export const toDCatalogCategory = (
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

export const toDCatalogEntryField = (
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
