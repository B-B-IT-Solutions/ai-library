import { DPromptDescriptorsFilter } from "@/data/types/domain/prompt";

export type DFiltersContext = {
   filters: DPromptDescriptorsFilter;
   setFilters: (filters: DPromptDescriptorsFilter) => void;
   hasActiveFilters: boolean;
};
