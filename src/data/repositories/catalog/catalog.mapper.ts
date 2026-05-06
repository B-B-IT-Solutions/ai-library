import { map } from "es-toolkit/compat";

import { CatalogEntryWithRelations } from "@/data/types/db/catalog";
import {
   DCatalogEntry,
   DCatalogEntryCategory,
   DCatalogEntryField,
   DCatalogEntrySummary,
} from "@/data/types/domain/catalog";
import { CatalogCategory, CatalogEntryField } from "@/generated/prisma/client";

export const toDCatalogEntrySummaries = (
   entries: CatalogEntryWithRelations[]
): DCatalogEntrySummary[] => {
   return map(entries, (e) => toDCatalogEntrySummary(e));
};

export const toDCatalogEntrySummary = (
   entry: CatalogEntryWithRelations
): DCatalogEntrySummary => {
   const { content: _content, ...rest } = toDCatalogEntry(entry);
   return rest;
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
      content: entry.content,
      status: entry.status,
      category: toDCatalogCategory(entry.category),
      fields: map(entry.fields, toDCatalogEntryField).sort(
         (a, b) => a.order - b.order
      ),
      copyCount: entry.copyCount,
      publishedAt: entry.publishedAt?.toISOString() ?? null,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
   };
};

export const toDCatalogCategory = (
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
