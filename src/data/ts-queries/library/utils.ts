export const libraryKeys = {
   all: ["library"] as const,
   entries: (filters?: any) => [...libraryKeys.all, "entries", filters] as const,
   entry: (entryId: string) => [...libraryKeys.all, "entry", entryId] as const,
   categories: () => [...libraryKeys.all, "categories"] as const,
   models: () => [...libraryKeys.all, "models"] as const,
   collections: () => [...libraryKeys.all, "collections"] as const,
   collectionEntries: (collectionId: string) =>
      [...libraryKeys.all, "collection", collectionId, "entries"] as const,
};
