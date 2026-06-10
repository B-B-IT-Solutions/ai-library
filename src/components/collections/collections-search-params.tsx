import {
   createSearchParamsCache,
   type inferParserType,
   parseAsString,
   parseAsStringEnum,
} from "nuqs/server";

import {
   DCollectionsSortByMode,
   DListGroupByMode,
   DListViewMode,
} from "@/data/types/domain/common";

export const viewParam = parseAsStringEnum<DListViewMode>(
   Object.values(DListViewMode)
).withDefault(DListViewMode.GRID);

export const groupByParam = parseAsStringEnum<DListGroupByMode>(
   Object.values(DListGroupByMode)
).withDefault(DListGroupByMode.NONE);

export const sortByParam = parseAsStringEnum<DCollectionsSortByMode>(
   Object.values(DCollectionsSortByMode)
).withDefault(DCollectionsSortByMode.NAME_ASC);

export const f_searchParam = parseAsString.withDefault("");

export const collectionsSearchParams = {
   view: viewParam,
   group: groupByParam,
   sort: sortByParam,
   f_search: f_searchParam,
};

export type DCollectionsSearchParamsType = Partial<
   inferParserType<typeof collectionsSearchParams>
>;

export type DCollectionsSearchParamsFiltersType = Omit<
   DCollectionsSearchParamsType,
   "view" | "group" | "sort"
>;

export const collectionsSearchParamsCache = createSearchParamsCache(
   collectionsSearchParams
);
