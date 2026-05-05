import {
   createSearchParamsCache,
   parseAsString,
   parseAsStringEnum,
} from "nuqs/server";

import { DExploreSortMode } from "@/data/types/domain/catalog";

export const qParam = parseAsString.withDefault("");
export const categoryParam = parseAsString.withDefault("");
export const sortParam = parseAsStringEnum<DExploreSortMode>([
   "newest",
   "popular",
]).withDefault("newest");

export const exploreSearchParams = {
   q: qParam,
   category: categoryParam,
   sort: sortParam,
};

export const exploreSearchParamsCache = createSearchParamsCache(
   exploreSearchParams
);
