export const libraryKeys = {
   all: ["library"] as const,
   entryCollections: (entryId: string) =>
      [...libraryKeys.all, "entry", entryId, "collections"] as const,
};
