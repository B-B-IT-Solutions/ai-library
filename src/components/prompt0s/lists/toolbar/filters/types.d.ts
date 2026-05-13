import { DPrompt0sFilter } from "@/data/types/domain/prompt0";

export type DFiltersContext = {
   filters: DPrompt0sFilter;
   setFilters: (filters: DPrompt0sFilter) => void;
   hasActiveFilters: boolean;
};
