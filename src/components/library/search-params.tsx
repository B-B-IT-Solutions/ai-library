import { createLoader, parseAsString, parseAsStringEnum } from "nuqs/server";

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

export const librarySearchParams = {
   view: viewParam,
   group: groupByParam,
   sort: sortByParam,
   search: parseAsString,
};

export const loadLibrarySearchParams = createLoader(librarySearchParams);
