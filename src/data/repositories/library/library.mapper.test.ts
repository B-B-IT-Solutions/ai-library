import { ptestData } from "@tests";
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

import {
   toDLibraryCollection,
   toDLibraryCollections,
   toDLibraryEntries,
   toDLibraryEntry,
   toDLibraryEntryWithPromptTemplate,
} from "./library.mapper";

const toDLibraryEntriesInternal = (
   entries: LibraryEntryWithPromptTemplateDescriptor[]
): DLibraryEntry[] => {
   return map(entries, (p) => toDLibraryEntryInternal(p));
};

const toDLibraryEntryInternal = (
   entry: LibraryEntryWithPromptTemplateDescriptor
): DLibraryEntry => {
   return {
      id: entry.id,
      userId: entry.userId,
      templateDescriptorId: entry.templateDescriptorId,
      templateDescriptor: toDPromptTemplateDescriptor(entry.templateDescriptor),
      isFavorite: entry.isFavorite,
      updatedAt: entry.updatedAt.toISOString(),
      createdAt: entry.createdAt.toISOString(),
   };
};

const toDLibraryEntryWithPromptTemplateInternal = (
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
      updatedAt: entry.updatedAt.toISOString(),
      createdAt: entry.createdAt.toISOString(),
   };
};

const toDLibraryCollectionsInternal = (
   collections: LibraryCollection[]
): DLibraryCollection[] => {
   return map(collections, (c) => toDLibraryCollectionInternal(c));
};

const toDLibraryCollectionInternal = (
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

describe("toDLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toDLibraryEntries test", async () => {
      const entries = ptestData.pLibraryEntriesWithTemplateDescriptor();
      const result = toDLibraryEntries(entries);
      const expectedResult = toDLibraryEntriesInternal(entries);
      expect(result).toEqual(expectedResult);
   });

   it("toDLibraryEntry test", async () => {
      const entry = ptestData.pLibraryEntryWithTemplateDescriptor();
      const result = toDLibraryEntry(entry);
      const expectedResult = toDLibraryEntryInternal(entry);
      expect(result).toEqual(expectedResult);
   });

   it("toDLibraryEntryWithPromptTemplate test", async () => {
      const entry = ptestData.pLibraryEntryWithPromptTemplate();
      const result = toDLibraryEntryWithPromptTemplate(entry);
      const expectedResult = toDLibraryEntryWithPromptTemplateInternal(entry);
      expect(result).toEqual(expectedResult);
   });
});

describe("toDLibraryCollections tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toDLibraryCollections test", async () => {
      const collections = ptestData.pLibraryCollections();
      const result = toDLibraryCollections(collections);
      const expectedResult = toDLibraryCollectionsInternal(collections);
      expect(result).toEqual(expectedResult);
   });

   it("toDLibraryCollection test", async () => {
      const collection = ptestData.pLibraryCollection();
      const result = toDLibraryCollection(collection);
      const expectedResult = toDLibraryCollectionInternal(collection);
      expect(result).toEqual(expectedResult);
   });
});
