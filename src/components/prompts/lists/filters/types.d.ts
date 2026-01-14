export type DFilters = {
   search: string;
   categories: string[];
};

export type DFiltersContext = {
   filters: DFilters;
   setFilters: (DFilters) => void;
};
