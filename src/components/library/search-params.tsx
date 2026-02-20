import { createLoader, parseAsString, parseAsStringEnum } from "nuqs/server";

import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

//    view?: DListViewMode;
//    group?: DListGroupByMode;
//    sort?: DListSortByMode;

export const librarySearchParams = {
   view: parseAsStringEnum<DListViewMode>(Object.values(DListViewMode)),
   //    group: parseAsStringLiteral,
   //    sort: parseAsStringLiteral,
   search: parseAsString,
};

export const loadLibrarySearchParams = createLoader(librarySearchParams);
