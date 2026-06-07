import { isEmpty } from "es-toolkit/compat";

import { DTemplatesSearchParamsFiltersType } from "@/components/prompts/search-params";

export const activeFiltersCount = (
   filters: DTemplatesSearchParamsFiltersType
) => {
   return [
      !isEmpty(filters.f_categories),
      !isEmpty(filters.f_models),
      !isEmpty(filters.f_collectionIds),
   ].filter(Boolean).length;
};
