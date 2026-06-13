import {
   createSearchParamsCache,
   parseAsString,
   parseAsStringEnum,
} from "nuqs/server";

import {
   DListViewMode,
   DWorkflowsSortByMode,
} from "@/data/types/domain/common";

export const viewParam = parseAsStringEnum<DListViewMode>(
   Object.values(DListViewMode)
).withDefault(DListViewMode.GRID);

export const sortByParam = parseAsStringEnum<DWorkflowsSortByMode>(
   Object.values(DWorkflowsSortByMode)
).withDefault(DWorkflowsSortByMode.TITLE_ASC);

export const f_searchParam = parseAsString.withDefault("");

export const workflowsSearchParams = {
   view: viewParam,
   sort: sortByParam,
   f_search: f_searchParam,
};

export const workflowsSearchParamsCache = createSearchParamsCache(
   workflowsSearchParams
);
