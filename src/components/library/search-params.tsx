import {
   createLoader,
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
)
   .withDefault(DListViewMode.GRID)
   .withOptions({ shallow: false });

export const groupByParam = parseAsStringEnum<DListGroupByMode>(
   Object.values(DListGroupByMode)
)
   .withDefault(DListGroupByMode.NONE)
   .withOptions({ shallow: false });

export const sortByParam = parseAsStringEnum<DListSortByMode>(
   Object.values(DListSortByMode)
)
   .withDefault(DListSortByMode.DATE_DESC)
   .withOptions({ shallow: false });

export const f_searchParam = parseAsString
   .withDefault("")
   .withOptions({ shallow: false });

export const f_categoriesParam = parseAsArrayOf(parseAsString)
   .withDefault([])
   .withOptions({ shallow: false });

export const f_modelsParam = parseAsArrayOf(parseAsString)
   .withDefault([])
   .withOptions({ shallow: false });

export const f_collectionIdsParam = parseAsArrayOf(parseAsString)
   .withDefault([])
   .withOptions({ shallow: false });

export const f_isFavoriteParam = parseAsBoolean
   .withDefault(false)
   .withOptions({ shallow: false });

export const librarySearchParams = {
   view: viewParam,
   group: groupByParam,
   sort: sortByParam,
   f_search: f_searchParam,
   f_categories: f_categoriesParam,
   f_models: f_modelsParam,
   f_collectionIds: f_collectionIdsParam,
   f_isFavorite: f_isFavoriteParam,
};

export const loadLibrarySearchParams = createLoader(librarySearchParams);
