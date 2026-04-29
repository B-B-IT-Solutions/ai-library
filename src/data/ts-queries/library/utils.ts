export const libraryKeys = {
   all: ["library"] as const,
   entryCollections: (entryId: string) =>
      [...libraryKeys.all, "entry", entryId, "collections"] as const,
   collections: () => [...libraryKeys.all, "collections"] as const,
   collection: (id: string) => [...libraryKeys.all, "collection", id] as const,
};
