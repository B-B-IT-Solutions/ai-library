"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, RotateCcw } from "lucide-react";
import { useQueryStates } from "nuqs";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/shadcn/popover";
import { Separator } from "@/components/shadcn/separator";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { DCollectionPreview } from "@/data/types/domain/collection";
import { templatesSearchParams } from "../../../search-params";

import { CategoriesFilter } from "./categories-filter";
import { CollectionsFilter } from "./collections-filter";
import { ModelsFilter } from "./models-filter";
import { activeFiltersCount } from "./utils";

type Props = {
   categories: string[];
   models: string[];
   collections: DCollectionPreview[];
};

export const PromptFilters = ({ categories, models, collections }: Props) => {
   const [showFilters, setShowFilters] = useState(false);

   const [filters, setFilters] = useQueryStates({
      f_categories: templatesSearchParams["f_categories"],
      f_models: templatesSearchParams["f_models"],
      f_collectionIds: templatesSearchParams["f_collectionIds"],
   });

   const resetFilters = () => {
      setFilters({
         f_categories: [],
         f_models: [],
         f_collectionIds: [],
      });
   };

   const filtersCount = activeFiltersCount(filters);
   const hasActiveFilters = filtersCount > 0;

   const renderFilters = () => {
      return (
         <div>
            <div className="mb-1 flex items-center justify-end">
               {hasActiveFilters && (
                  <Tooltip>
                     <TooltipTrigger asChild={true}>
                        <Button
                           variant="ghost"
                           size="icon"
                           onClick={resetFilters}
                           className="h-6 w-6 text-slate-500 hover:text-slate-900"
                           data-testid="reset-btn"
                        >
                           <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>Filter zurücksetzen</TooltipContent>
                  </Tooltip>
               )}
            </div>
            <div className="space-y-4">
               <CollectionsFilter collections={collections} />
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
