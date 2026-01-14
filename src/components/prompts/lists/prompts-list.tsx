"use client";

import { FC, useState } from "react";
import { map, sum } from "es-toolkit/compat";
import { FileText, Filter, Loader2, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { useInfiniteLoadPrompts } from "@/data/ts-queries/prompt";

import { FiltersContext, initFilters } from "./filters/context";
import { PromptFilters } from "./filters/prompts-filter";
import { DFiltersContext } from "./filters/types";
import { PromptListItem } from "./prompt-list-item";

export const PromptsList: FC = () => {
   const [showFilters, setShowFilters] = useState<boolean>(false);
   const [filters, setFilters] = useState(initFilters);

   const fitlerContext: DFiltersContext = {
      filters,
      setFilters,
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

   const promptItemsHeader = () => {
      const activeFilterCount =
         (filters.search ? 1 : 0) + (filters.categories?.length || 0);

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
               <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`relative transition-all duration-200 ${
                     showFilters
                        ? "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                        : "hover:bg-slate-50"
                  }`}
                  data-testid="toggle-filters-btn"
               >
                  <Filter className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Filter</span>
                  {activeFilterCount > 0 && (
                     <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                        {activeFilterCount}
                     </span>
                  )}
               </Button>

               <Button
                  asChild={true}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  data-testid="add-prompt-btn"
               >
                  <Link href="/prompts/new" className="flex items-center gap-2">
                     <Plus className="w-4 h-4" />
                     <span className="text-sm font-medium">Neu</span>
                  </Link>
               </Button>
            </div>
         </div>
      );
   };

   const promptFilters = () => {
      if (!showFilters) {
         return null;
      }

      return (
         <div
            className="px-6 py-4 border-b border-slate-200/80 bg-white animate-in slide-in-from-top-4 duration-200"
            data-testid="prompts-filter-container"
         >
            <PromptFilters />
         </div>
      );
   };

   const promptItems = () => {
      const hasPrompts = pages.some((page) => page.content.length > 0);

      if (!hasPrompts) {
         return (
            <div className="flex-1 flex items-center justify-center p-8">
               <div className="text-center max-w-md">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                     <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                     Keine Prompts gefunden
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                     Beginnen Sie, indem Sie Ihren ersten Prompt erstellen.
                  </p>
                  <Button
                     asChild={true}
                     className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                     <Link
                        href="/prompts/new"
                        className="flex items-center gap-2"
                     >
                        <Plus className="w-4 h-4" />
                        <span>Prompt erstellen</span>
                     </Link>
                  </Button>
               </div>
            </div>
         );
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
