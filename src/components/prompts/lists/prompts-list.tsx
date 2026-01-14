"use client";

import { FC, useState } from "react";
import { isEmpty, map, sum } from "es-toolkit/compat";
import { Filter, Loader2, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { useInfiniteLoadPrompts } from "@/data/ts-queries/prompt";
import { cn } from "@/lib/utils";

import { FiltersContext, initFilters } from "./filters/context";
import { PromptFilters } from "./filters/prompts-filter";
import { DFiltersContext } from "./filters/types";
import { PromptListItem } from "./items/prompt-list-item";
import { EmptyPromptListItems } from "./items/prompt-list-items-empty";

export const PromptsList: FC = () => {
   const [showFilters, setShowFilters] = useState<boolean>(false);
   const [filters, setFilters] = useState(initFilters);

   const calculateFiltersCount = () => {
      let count = 0;
      count += filters.search ? 1 : 0;
      count += !isEmpty(filters.categories) ? 1 : 0;
      return count;
   };

   const activeFilterCount = calculateFiltersCount();
   const hasActiveFilters = activeFilterCount > 0;

   const fitlerContext: DFiltersContext = {
      filters,
      setFilters,
      hasActiveFilters,
   };

   const {
      data: { pages = [] } = {},
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useInfiniteLoadPrompts({
      ...filters,
   });

   const count = sum(map(pages, (p) => p.numberOfElements));
   const hasPrompts = pages.some((page) => page.content.length > 0);

   const filtersBtn = () => {
      const styles = showFilters
         ? "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
         : "hover:bg-slate-50";

      return (
         <Button
            size="sm"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn("relative transition-all duration-200", styles)}
            data-testid="filters-btn"
         >
            <Filter className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Filter</span>
            {hasActiveFilters && !showFilters && (
               <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {activeFilterCount}
               </span>
            )}
         </Button>
      );
   };

   const createPromptBtn = () => {
      return (
         <Button
            asChild={true}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
            data-testid="create-prompt-btn"
         >
            <Link href="/prompts/new" className="flex items-center gap-2">
               <Plus className="w-4 h-4" />
               <span className="text-sm font-medium">Neu</span>
            </Link>
         </Button>
      );
   };

   const promptItemsHeader = () => {
      return (
         <div
            className="px-6 py-4 border-b border-slate-200/80 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/50 sticky top-0 z-10 backdrop-blur-sm"
            data-testid="prompts-list-header"
         >
            <div className="flex items-center gap-3">
               <h3 className="text-base font-bold text-slate-800 tracking-tight">
                  Bibliothek
               </h3>
               <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full shadow-sm">
                  {count}
               </span>
            </div>
            <div className="flex items-center gap-2">
               {filtersBtn()}
               {createPromptBtn()}
            </div>
         </div>
      );
   };

   const promptFilters = () => {
      if (!showFilters) {
         return null;
      }
      return <PromptFilters />;
   };

   const promptItems = () => {
      if (!hasPrompts) {
         return <EmptyPromptListItems />;
      }

      return (
         <div
            className="flex-1 px-1 pt-1 overflow-y-auto bg-slate-50/30"
            data-testid="prompts-list-items"
         >
            <div className="flex flex-col space-y-1">
               {map(pages, (page) => {
                  return map(page.content, (prompt) => {
                     return <PromptListItem key={prompt.id} prompt={prompt} />;
                  });
               })}
            </div>
            <InfiniteScroll
               hasMore={hasNextPage}
               isLoading={isFetchingNextPage}
               next={fetchNextPage}
               threshold={0.7}
            >
               {hasNextPage && (
                  <div className="flex justify-center py-6">
                     <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
               )}
            </InfiniteScroll>
         </div>
      );
   };

   return (
      <div className="flex flex-col h-full bg-white" data-testid="prompts-list">
         <FiltersContext.Provider value={fitlerContext}>
            {promptItemsHeader()}
            {promptFilters()}
            {promptItems()}
         </FiltersContext.Provider>
      </div>
   );
};
