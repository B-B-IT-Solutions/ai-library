import { filterQueryKey } from "../utils";

import { LoadCollectionsPageParams } from "./types";

export const collectionKeys = {
   all: ["collections"] as const,
   collectionsPage: ({ filters, sort }: LoadCollectionsPageParams) =>
      [...collectionKeys.all, filterQueryKey(filters, sort)] as const,
   collectionPreviews: () => [...collectionKeys.all, "previews"] as const,
   collection: (id: string) =>
      [...collectionKeys.all, "collection", id] as const,
   collectionPromptIds: (id: string) =>
      [...collectionKeys.all, "collection", id, "promptIds"] as const,
};
