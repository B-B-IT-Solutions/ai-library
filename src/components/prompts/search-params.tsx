import {
   createSearchParamsCache,
   type inferParserType,
   parseAsArrayOf,
   parseAsBoolean,
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

export const f_modelsParam = parseAsArrayOf(parseAsString).withDefault([]);

export const f_collectionIdsParam = parseAsArrayOf(parseAsString).withDefault(
   []
);

export const f_isFavoriteParam = parseAsBoolean.withDefault(false);

export const templatesSearchParams = {
   view: viewParam,
   group: groupByParam,
   sort: sortByParam,
   f_search: f_searchParam,
   f_categories: f_categoriesParam,
   f_models: f_modelsParam,
   f_collectionIds: f_collectionIdsParam,
   f_isFavorite: f_isFavoriteParam,
};

export type DTemplatesSearchParamsType = Partial<
   inferParserType<typeof templatesSearchParams>
>;

export type DTemplatesSearchParamsFiltersType = Omit<
   DTemplatesSearchParamsType,
   "view" | "group" | "sort"
>;

export const templatesSearchParamsCache = createSearchParamsCache(
   templatesSearchParams
);
