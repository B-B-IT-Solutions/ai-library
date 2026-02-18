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
      createdAt: entry.createdAt.toISOString(),
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
      createdAt: entry.createdAt.toISOString(),
   };
};
