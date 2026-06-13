import {
   createSearchParamsCache,
   parseAsString,
   parseAsStringEnum,
} from "nuqs/server";

import { DWorkflowsSortByMode } from "@/data/types/domain/common";

export const sortByParam = parseAsStringEnum<DWorkflowsSortByMode>(
   Object.values(DWorkflowsSortByMode)
).withDefault(DWorkflowsSortByMode.DATE_DESC);

export const f_searchParam = parseAsString.withDefault("");

export const workflowsSearchParams = {
   sort: sortByParam,
   f_search: f_searchParam,
};

export const workflowsSearchParamsCache = createSearchParamsCache(
   workflowsSearchParams
);
