"use client";

import { FC, useMemo, useState } from "react";
import { isEmpty } from "es-toolkit/compat";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { useQueryStates } from "nuqs";

import { Button } from "@/components/shadcn/button";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
import { Separator } from "@/components/shadcn/separator";
import { DLibraryEntriesFilter } from "@/data/types/domain/library";
import { librarySearchParams } from "../search-params";

import { CategoriesFilter } from "./categories-filter";
import {
   LibraryEntryFilterContext,
   LibraryEntryFiltersHelper,
} from "./filters-context";
import { ModelsFilter } from "./models-filter";
import { SearchFilter } from "./search-filter";

type Props = {
   filters: DLibraryEntriesFilter;
};

export const LibraryFilters: FC<Props> = ({ filters }) => {
   const [showFilters, setShowFilters] = useState(false);
   const [filtersContext] = useState<LibraryEntryFiltersHelper>(
      new LibraryEntryFiltersHelper(filters)
   );

   const [filters_, setFilters_] = useQueryStates(
      {
         f_search: librarySearchParams["f_search"],
         f_categories: librarySearchParams["f_categories"],
         f_models: librarySearchParams["f_models"],
      },
      {
         shallow: false,
      }
   );

   const applyFilters = () => {
      setFilters_(filtersContext.getFilters());
      setShowFilters(false);
   };

   const hasActiveFilters = useMemo(() => {
      return (
         !isEmpty(filters.search) ||
         !isEmpty(filters.categories) ||
         !isEmpty(filters.models) ||
         !isEmpty(filters.models) ||
         filters.isFavorite
      );
   }, [filters]);

   const renderFilters = () => {
      return (
         <div>
            <div className="flex items-center justify-end">
               {hasActiveFilters && (
                  <Button
                     variant="ghost"
                     size="sm"
                     // onClick={resetFilters}
                     className="h-8 px-2 text-xs"
                  >
                     <X className="mr-1 h-3 w-3" />
                     Zurücksetzen
                  </Button>
               )}
            </div>
            <LibraryEntryFilterContext.Provider value={filtersContext}>
               <div className="space-y-4">
                  <SearchFilter />
                  <Separator />
                  <CategoriesFilter />
                  <Separator />
                  <ModelsFilter />
               </div>
            </LibraryEntryFilterContext.Provider>
         </div>
      );
   };

   return (
      <Popover open={showFilters} onOpenChange={setShowFilters}>
         <PopoverTrigger asChild={true} data-testid="library-entry-filters">
            <Button
               variant="outline"
               size="sm"
               onClick={() => setShowFilters(!showFilters)}
               className="gap-2"
            >
               <Filter className="h-4 w-4" />
               Filter
               {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
               ) : (
                  <ChevronDown className="h-4 w-4" />
               )}
            </Button>
         </PopoverTrigger>
         <PopoverContent>
            {renderFilters()}
            <Button
               variant="outline"
               size="sm"
               onClick={applyFilters}
               data-testid="apply-filters-btn"
            >
               OK
            </Button>
         </PopoverContent>
      </Popover>
   );
};
