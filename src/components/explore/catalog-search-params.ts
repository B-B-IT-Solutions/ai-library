import {
   createSearchParamsCache,
   parseAsArrayOf,
   parseAsString,
   parseAsStringEnum,
} from "nuqs/server";

import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

export const viewParam = parseAsStringEnum<DListViewMode>(
   Object.values(DListViewMode)
).withDefault(DListViewMode.GRID);

export const groupByParam = parseAsStringEnum<DListGroupByMode>(
   Object.values(DListGroupByMode)
).withDefault(DListGroupByMode.NONE);

export const sortByParam = parseAsStringEnum<DListSortByMode>(
   Object.values(DListSortByMode)
).withDefault(DListSortByMode.DATE_DESC);

export const f_searchParam = parseAsString.withDefault("");

export const f_categoriesParam = parseAsArrayOf(parseAsString).withDefault([]);

export const catalogEntrySearchParams = {
   view: viewParam,
   group: groupByParam,
   sort: sortByParam,
   f_search: f_searchParam,
   f_categories: f_categoriesParam,
};

export const catalogEntrySearchParamsCache = createSearchParamsCache(
   catalogEntrySearchParams
);
