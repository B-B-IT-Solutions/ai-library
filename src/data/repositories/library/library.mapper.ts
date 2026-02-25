import { map } from "es-toolkit/compat";

import {
   toDPromptTemplateDescriptor,
   toDPromptTemplateDescriptorWithTemplate,
} from "@/data/repositories/prompt-template/prompt.template.mapper";
import {
   LibraryEntryWithPromptTemplate,
   LibraryEntryWithPromptTemplateDescriptor,
} from "@/data/types/db/library";
import {
   DLibraryCollection,
   DLibraryEntry,
   DLibraryEntryWithPromptTemplate,
} from "@/data/types/domain/library";
import { LibraryCollection } from "@/generated/prisma/client";

export const toDLibraryEntries = (
   entries: LibraryEntryWithPromptTemplateDescriptor[]
): DLibraryEntry[] => {
   return map(entries, (p) => toDLibraryEntry(p));
};

export const toDLibraryEntry = (
   entry: LibraryEntryWithPromptTemplateDescriptor
): DLibraryEntry => {
   return {
      id: entry.id,
      userId: entry.userId,
      templateDescriptorId: entry.templateDescriptorId,
      templateDescriptor: toDPromptTemplateDescriptor(entry.templateDescriptor),
      isFavorite: entry.isFavorite,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
   };
};

export const toDLibraryEntryWithPromptTemplate = (
   entry: LibraryEntryWithPromptTemplate
): DLibraryEntryWithPromptTemplate => {
   return {
      id: entry.id,
      userId: entry.userId,
      templateDescriptorId: entry.templateDescriptorId,
      templateDescriptor: toDPromptTemplateDescriptorWithTemplate(
         entry.templateDescriptor
      ),
      isFavorite: entry.isFavorite,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
   };
};

// ==================== Collection Mappers ====================

export const toDLibraryCollections = (
   collections: LibraryCollection[]
): DLibraryCollection[] => {
   return map(collections, (c) => toDLibraryCollection(c));
};

export const toDLibraryCollection = (
   collection: LibraryCollection
): DLibraryCollection => {
   return {
      id: collection.id,
      userId: collection.userId,
      name: collection.name,
      description: collection.description,
      color: collection.color,
      order: collection.order,
      createdAt: collection.createdAt.toISOString(),
      updatedAt: collection.updatedAt.toISOString(),
   };
};
