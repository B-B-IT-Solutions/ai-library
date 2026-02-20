"use client";

import { FC, useMemo, useState } from "react";
import { isEmpty } from "es-toolkit/compat";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
import { Separator } from "@/components/shadcn/separator";
import { DLibraryEntriesFilter } from "@/data/types/domain/library";

import { CategoriesFilter } from "./categories-filter";
import { ModelsFilter } from "./models-filter";
import { SearchFilter } from "./search-filter";

type Props = {
   filters: DLibraryEntriesFilter;
};

export const LibraryFilters: FC<Props> = ({ filters }) => {
   const [showFilters, setShowFilters] = useState(false);

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

            <div className="space-y-4">
               <SearchFilter />
               <Separator />
               <CategoriesFilter />
               <Separator />
               <ModelsFilter />
            </div>
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
         <PopoverContent>{renderFilters()}</PopoverContent>
      </Popover>
   );
};
