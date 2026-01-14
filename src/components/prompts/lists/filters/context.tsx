import { createContext, FC, ReactNode, useState } from "react";

import { DFilters, DFiltersContext } from "./types";

export const initFilters: DFilters = {
   search: "",
   categories: [],
};

export const FiltersContext = createContext<DFiltersContext | null>(null);

type FiltersContextProviderProps = {
   children: ReactNode;
};

export const FiltersContextProvider: FC<FiltersContextProviderProps> = ({
   children,
}) => {
   const [filters, setFilters] = useState(initFilters);

   const context: DFiltersContext = {
      filters,
      setFilters,
   };

   console.log("categories", filters.categories);

   return (
      <FiltersContext.Provider value={context}>
         <div key={filters.categories.length}> {children}</div>
      </FiltersContext.Provider>
   );
};
