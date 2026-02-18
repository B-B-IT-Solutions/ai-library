import { map } from "es-toolkit/compat";

import {
   toDPromptTemplateDescriptor,
   toDPromptTemplateDescriptorWithTemplate,
} from "@/data/repositories/prompt-template/prompt.template.mapper";
import {
   LibraryCollectionWithCount,
   LibraryEntryWithCollections,
   LibraryEntryWithPromptTemplate,
   LibraryEntryWithPromptTemplateDescriptor,
} from "@/data/types/db/library";
import {
   DLibraryCollection,
   DLibraryEntry,
   DLibraryEntryWithPromptTemplate,
} from "@/data/types/domain/library";

export const toDLibraryEntries = (
   entries: LibraryEntryWithPromptTemplateDescriptor[]
): DLibraryEntry[] => {
   return map(entries, (p) => toDLibraryEntry(p));
};

export const toDLibraryEntry = (
   entry: LibraryEntryWithPromptTemplateDescriptor | LibraryEntryWithCollections
): DLibraryEntry => {
   const collections = "collectionEntries" in entry
      ? map(entry.collectionEntries, (ce) => ce.collectionId)
      : [];

   return {
      id: entry.id,
      userId: entry.userId,
      templateDescriptorId: entry.templateDescriptorId,
      templateDescriptor: toDPromptTemplateDescriptor(entry.templateDescriptor),
      isFavorite: entry.isFavorite,
      collections,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
   };
};

export const toDLibraryEntryWithPromptTemplate = (
   entry: LibraryEntryWithPromptTemplate
): DLibraryEntryWithPromptTemplate => {
   const collections = "collectionEntries" in entry
      ? map(entry.collectionEntries, (ce) => ce.collectionId)
      : [];

   return {
      id: entry.id,
      userId: entry.userId,
      templateDescriptorId: entry.templateDescriptorId,
      templateDescriptor: toDPromptTemplateDescriptorWithTemplate(
         entry.templateDescriptor
      ),
      isFavorite: entry.isFavorite,
      collections,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
   };
};

// ==================== Collection Mappers ====================

export const toDLibraryCollections = (
   collections: LibraryCollectionWithCount[]
): DLibraryCollection[] => {
   return map(collections, (c) => toDLibraryCollection(c));
};

export const toDLibraryCollection = (
   collection: LibraryCollectionWithCount
): DLibraryCollection => {
   return {
      id: collection.id,
      userId: collection.userId,
      name: collection.name,
      description: collection.description,
      color: collection.color,
      order: collection.order,
      entryCount: collection._count.entries,
      createdAt: collection.createdAt.toISOString(),
      updatedAt: collection.updatedAt.toISOString(),
   };
};
