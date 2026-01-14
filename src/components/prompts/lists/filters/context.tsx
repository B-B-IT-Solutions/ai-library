import { createContext, FC, ReactNode, useState } from "react";

import { DPromptDescriptorsFilter } from "@/data/types/domain/prompt";

import { DFiltersContext } from "./types";

export const initFilters: DPromptDescriptorsFilter = {
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

   return (
      <FiltersContext.Provider value={context}>
         {children}
      </FiltersContext.Provider>
   );
};
