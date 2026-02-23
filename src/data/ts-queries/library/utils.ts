import { DLibraryEntriesFilter } from "@/data/types/domain/library";

export const libraryKeys = {
   all: ["library"] as const,
   entries: (filters?: DLibraryEntriesFilter) =>
      [...libraryKeys.all, "entries", filters] as const,
   collections: () => [...libraryKeys.all, "collections"] as const,
};
