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
            className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50"
            data-testid="prompts-list-header"
         >
            <h2 className="font-semibold text-slate-900">Prompts ({count})</h2>

            <Button
               asChild={true}
               className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
               data-testid="add-prompt-btn"
            >
               <Link href="/prompt/new">
                  <Plus className="w-4 h-4" />
               </Link>
            </Button>
         </div>
      );
   };

   const promptItems = () => {
      return (
         <div
            className="divide-y divide-slate-200 max-h-[500px] overflow-y-auto"
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
                  <div className="flex flex-center">
                     <Loader2 className="my-4 h-8 w-8 animate-spin flex items-center" />
                  </div>
               )}
            </InfiniteScroll>
         </div>
      );
   };

   const promptItemsList = () => {
      return (
         <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            {promptItemsHeader()}
            {promptItems()}
         </div>
      );
   };

   const promptFilters = () => {
      return <PromptFilters onFiltersUpdate={setFilters} />;
   };

   return (
      <div className="lg:col-span-1 space-y-4" data-testid="prompts-list">
         {promptFilters()}
         {promptItemsList()}
      </div>
   );
};
