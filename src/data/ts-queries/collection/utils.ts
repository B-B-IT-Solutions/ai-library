import { filterQueryKey } from "../utils";

import { LoadCollectionsPageParams } from "./types";

export const collectionKeys = {
   all: ["collections"] as const,
   collectionsPage: ({ filters, sort }: LoadCollectionsPageParams) =>
      [...collectionKeys.all, filterQueryKey(filters, sort)] as const,
   collection: (id: string) =>
      [...collectionKeys.all, "collection", id] as const,
   collectionTemplateIds: (id: string) =>
      [...collectionKeys.all, "collection", id, "templateIds"] as const,
};
