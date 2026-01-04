import { map } from "es-toolkit/compat";

import { toDPromptTemplateDescriptor } from "@/data/services/prompt/prompt.mapper";
import { LibraryEntryWithTemplate } from "@/data/types/db/library";
import { DLibraryEntry } from "@/data/types/domain/library";

export const toDLibraryEntries = (
   entries: LibraryEntryWithTemplate[]
): DLibraryEntry[] => {
   return map(entries, (p) => toDLibraryEntry(p));
};

export const toDLibraryEntry = (
   entry: LibraryEntryWithTemplate
): DLibraryEntry => {
   return {
      id: entry.id,
      userId: entry.userId,
      orderId: entry.orderId,
      templateId: entry.templateId,
      productId: entry.productId,
      templateDescriptor: toDPromptTemplateDescriptor(entry.template),
      createdAt: entry.createdAt.toISOString(),
   };
};
