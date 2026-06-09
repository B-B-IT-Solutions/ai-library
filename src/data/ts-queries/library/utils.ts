import type { LoadCollectionsPageParams } from "./types";

export const libraryKeys = {
   all: ["library"] as const,
   entryCollections: (entryId: string) =>
      [...libraryKeys.all, "entry", entryId, "collections"] as const,
   collections: () => [...libraryKeys.all, "collections"] as const,
   collectionsPage: (params?: LoadCollectionsPageParams) =>
      [...libraryKeys.all, "collections-page", ...(params ? [params] : [])] as const,
   collection: (id: string) => [...libraryKeys.all, "collection", id] as const,
   collectionPreviews: () =>
      [...libraryKeys.all, "collection-previews"] as const,
};
