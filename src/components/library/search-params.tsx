import { createLoader, parseAsString, parseAsStringEnum } from "nuqs/server";

import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

export const librarySearchParams = {
   view: parseAsStringEnum<DListViewMode>(
      Object.values(DListViewMode)
   ).withDefault(DListViewMode.GRID),
   group: parseAsStringEnum<DListGroupByMode>(
      Object.values(DListGroupByMode)
   ).withDefault(DListGroupByMode.NONE),
   sort: parseAsStringEnum<DListSortByMode>(
      Object.values(DListSortByMode)
   ).withDefault(DListSortByMode.DATE_DESC),
   search: parseAsString,
};

export const loadLibrarySearchParams = createLoader(librarySearchParams);
