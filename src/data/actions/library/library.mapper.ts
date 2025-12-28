import { map } from "es-toolkit/compat";

import { toDPromptTemplate } from "@/data/actions/prompt/prompt.mapper";
import { DLibraryEntry } from "@/data/types/domain/library";
import { Library } from "@/generated/prisma/client";

export const toDLibraryEntries = (entries: Library[]): DLibraryEntry[] => {
   return map(entries, (p) => toDLibraryEntry(p));
};

export const toDLibraryEntry = (entry: Library): DLibraryEntry => {
   return {
      id: entry.id,
      userId: entry.userId,
      orderId: entry.orderId,
      templateId: entry.templateId,
      template: toDPromptTemplate(entry.template),
      createdAt: entry.createdAt.toISOString(),
   };
};
