"use client";

import { FC, useState } from "react";
import { map, sum } from "es-toolkit/compat";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { useInfiniteLoadPrompts } from "@/data/ts-queries/prompt";

import { PromptListItem } from "./prompt-list-item";
import { Filters, PromptFilters } from "./prompts-filter";

export const PromptsList: FC = () => {
   const [filters, setFilters] = useState<Filters>({});

   const {
      data: { pages = [] } = {},
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useInfiniteLoadPrompts({
      search: filters.search,
      categories: filters.categories,
   });

   const count = sum(map(pages, (p) => p.numberOfElements));

   const promptItemsHeader = () => {
      return (
         <div
            className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10"
            data-testid="prompts-list-header"
         >
            <div className="flex items-center gap-2">
               <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Library
               </h3>
               <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {count}
               </span>
            </div>

            <Button
               asChild={true}
               size="sm"
               className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
               data-testid="add-prompt-btn"
            >
               <Link href="/prompts/new" className="flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">New</span>
               </Link>
            </Button>
         </div>
      );
   };

   const promptItems = () => {
      return (
         <div
            className="flex-1 overflow-y-auto"
            data-testid="prompts-list-items"
         >
            {map(pages, (page) => {
               return map(page.content, (prompt) => {
                  return <PromptListItem key={prompt.id} prompt={prompt} />;
               });
            })}
            <InfiniteScroll
               hasMore={hasNextPage}
               isLoading={isFetchingNextPage}
               next={fetchNextPage}
               threshold={0.7}
            >
               {hasNextPage && (
                  <div className="flex justify-center py-4">
                     <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
               )}
            </InfiniteScroll>
         </div>
      );
   };

   const promptFilters = () => {
      return (
         <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <PromptFilters onFiltersUpdate={setFilters} />
         </div>
      );
   };

   return (
      <div className="flex flex-col h-full" data-testid="prompts-list">
         {promptItemsHeader()}
         {promptFilters()}
         {promptItems()}
      </div>
   );
};
