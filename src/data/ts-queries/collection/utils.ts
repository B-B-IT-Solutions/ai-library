export const collectionKeys = {
   all: ["collections"] as const,
   collections: () => [...collectionKeys.all] as const,
   collection: (id: string) =>
      [...collectionKeys.all, "collection", id] as const,
   collectionTemplateIds: (id: string) =>
      [...collectionKeys.all, "collection", id, "templateIds"] as const,
};
