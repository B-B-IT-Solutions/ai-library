export const libraryKeys = {
   all: ["library"] as const,
   promptCollections: (promptId: string) =>
      [...libraryKeys.all, "prompt", promptId, "collections"] as const,
};
