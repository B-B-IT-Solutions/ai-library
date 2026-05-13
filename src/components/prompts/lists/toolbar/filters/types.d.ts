import { DPrompt0sFilter } from "@/data/types/domain/prompt";

export type DFiltersContext = {
   filters: DPrompt0sFilter;
   setFilters: (filters: DPrompt0sFilter) => void;
   hasActiveFilters: boolean;
};
