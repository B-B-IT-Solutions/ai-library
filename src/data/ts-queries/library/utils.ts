import { filterQueryKey } from "../utils";

import { LoadLibraryEntriesParams } from "./types";

export const libraryKeys = {
   all: ["library"] as const,
   entries: ({ filters, sort }: LoadLibraryEntriesParams) =>
      [...libraryKeys.all, "entries", filterQueryKey(filters, sort)] as const,
   entryCollections: (entryId: string) =>
      [...libraryKeys.all, "entry", entryId, "collections"] as const,
   collections: () => [...libraryKeys.all, "collections"] as const,
   collection: (id: string) => [...libraryKeys.all, "collection", id] as const,
};
