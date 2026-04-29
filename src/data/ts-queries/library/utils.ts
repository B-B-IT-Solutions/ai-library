import { LoadTemplateDescriptorsParams } from "../prompt-template/types";
import { filterQueryKey } from "../utils";

export const libraryKeys = {
   all: ["library"] as const,
   entries: ({ filters, sort }: LoadTemplateDescriptorsParams) =>
      [...libraryKeys.all, "entries", filterQueryKey(filters, sort)] as const,
   entryCollections: (entryId: string) =>
      [...libraryKeys.all, "entry", entryId, "collections"] as const,
   collections: () => [...libraryKeys.all, "collections"] as const,
};
