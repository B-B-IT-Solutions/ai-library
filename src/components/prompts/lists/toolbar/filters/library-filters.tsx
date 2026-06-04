"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { useQueryStates } from "nuqs";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
import { Separator } from "@/components/shadcn/separator";
import { templatesSearchParams } from "../../../search-params";

import { CategoriesFilter } from "./categories-filter";
import {
   LibraryEntryFilterContext,
   LibraryEntryFiltersHelper,
} from "./filters-context";
import { ModelsFilter } from "./models-filter";
import { SearchFilter } from "./search-filter";

type Props = {
   categories: string[];
   models: string[];
};

export const LibraryFilters = ({ categories, models }: Props) => {
   const [showFilters, setShowFilters] = useState(false);

   const [filters, setFilters] = useQueryStates({
      f_search: templatesSearchParams["f_search"],
      f_categories: templatesSearchParams["f_categories"],
      f_models: templatesSearchParams["f_models"],
   });

   const [filtersContext] = useState<LibraryEntryFiltersHelper>(
      new LibraryEntryFiltersHelper(filters)
   );

   const applyFilters = () => {
      setFilters(filtersContext.getFilters());
      setShowFilters(false);
   };

   const resetFilters = () => {
      filtersContext.resetFilters();
      applyFilters();
   };

   const hasActiveFilters = filtersContext.hasActiveFilters();
   const activeFilterCount = filtersContext.getActiveFiltersCount();

   const renderFilters = () => {
      return (
         <div>
            <div className="flex items-center justify-end">
               {hasActiveFilters && (
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={resetFilters}
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
                  <CategoriesFilter categories={categories} />
                  <Separator />
                  <ModelsFilter models={models} />
               </div>
               <div className="mt-3 flex justify-end">
                  <Button
                     variant="default"
                     size="sm"
                     onClick={applyFilters}
                     data-testid="apply-filters-btn"
                  >
                     OK
                  </Button>
               </div>
            </LibraryEntryFilterContext.Provider>
         </div>
      );
   };

   const triggerBtnIcon = () => {
      const Icon = showFilters ? ChevronUp : ChevronDown;
      return <Icon className="h-4 w-4" />;
   };

   return (
      <Popover open={showFilters} onOpenChange={setShowFilters}>
         <PopoverTrigger asChild={true}>
            <Button
               variant="outline"
               size="sm"
               onClick={() => setShowFilters(!showFilters)}
               className="gap-2"
               data-testid="library-entry-filters-trigger"
            >
               <Filter className="h-4 w-4" />
               Filter
               {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                     {activeFilterCount}
                  </Badge>
               )}
               {triggerBtnIcon()}
            </Button>
         </PopoverTrigger>
         <PopoverContent>{renderFilters()}</PopoverContent>
      </Popover>
   );
};
