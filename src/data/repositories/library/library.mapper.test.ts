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
   DLibraryEntry,
   DLibraryEntryWithPromptTemplate,
} from "@/data/types/domain/library";

import {
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
