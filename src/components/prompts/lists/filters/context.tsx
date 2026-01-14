import { createContext, FC, ReactNode, useState } from "react";

import { DFilters, DFiltersContext } from "./types";

export const FiltersContext = createContext<DFiltersContext | null>(null);

type FiltersContextProviderProps = {
   children: ReactNode;
};

export const FiltersContextProvider: FC<FiltersContextProviderProps> = ({
   children,
}) => {
   const initFilters: DFilters = {
      search: "",
      categories: [],
   };

   const [filters, setFilters] = useState(initFilters);

   const context: DFiltersContext = {
      filters,
      setFilters,
   };

   return (
      <FiltersContext.Provider value={context}>
         {children}
      </FiltersContext.Provider>
   );
};
