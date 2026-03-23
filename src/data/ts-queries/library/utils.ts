import { DListSortByMode } from "@/data/types/domain/common";
import { DLibraryEntriesFilter } from "@/data/types/domain/library";

export const libraryKeys = {
   all: ["library"] as const,
   entries: (filters?: DLibraryEntriesFilter, sortBy?: DListSortByMode) =>
      [...libraryKeys.all, "entries", filters, sortBy] as const,
   entryCollections: (entryId: string) =>
      [...libraryKeys.all, "entry", entryId, "collections"] as const,
   collections: () => [...libraryKeys.all, "collections"] as const,
};
