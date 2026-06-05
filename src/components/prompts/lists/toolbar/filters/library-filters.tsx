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
import { ModelsFilter } from "./models-filter";
import { SearchFilter } from "./search-filter";
import { activeFiltersCount } from "./utils";

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

   const resetFilters = () => {
      setFilters({ f_search: "", f_categories: [], f_models: [] });
   };

   const filtersCount = activeFiltersCount(filters);
   const hasActiveFilters = filtersCount > 0;

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
                     data-testid="reset-btn"
                  >
                     <X className="mr-1 h-3 w-3" />
                     Zurücksetzen
                  </Button>
               )}
            </div>
            <div className="space-y-4">
               <SearchFilter />
               <Separator />
               <CategoriesFilter categories={categories} />
               <Separator />
               <ModelsFilter models={models} />
            </div>
         </div>
      );
   };

   const triggerBtnIcon = () => {
      const Icon = showFilters ? ChevronUp : ChevronDown;
      return <Icon className="h-4 w-4" />;
   };

   return (
      <Popover open={showFilters} onOpenChange={setShowFilters}>
         <div className="relative inline-flex">
            <PopoverTrigger asChild={true}>
               <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  data-testid="filters-trigger-btn"
               >
                  <Filter className="h-4 w-4" />
                  Filter
                  {triggerBtnIcon()}
               </Button>
            </PopoverTrigger>

            {filtersCount > 0 && (
               <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full p-0 text-xs"
                  data-testid="count-badge"
               >
                  {filtersCount}
               </Badge>
            )}
         </div>
         <PopoverContent>{renderFilters()}</PopoverContent>
      </Popover>
   );
};
