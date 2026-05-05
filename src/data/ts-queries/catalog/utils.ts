import { filterQueryKey } from "../utils";

import type { LoadCatalogEntriesParams } from "./types";

export const catalogEntryKeys = {
   all: ["catalog-entries"] as const,
   entries: ({ filters, sort }: LoadCatalogEntriesParams) =>
      [...catalogEntryKeys.all, filterQueryKey(filters, sort)] as const,
};

export const catalogEntryCategoriesKeys = {
   all: ["catalog-entry-categories"],
   categories: () => {
      return [...catalogEntryCategoriesKeys.all] as const;
   },
};
