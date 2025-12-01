"use client";

import { FC, useState } from "react";
import { map, sum } from "es-toolkit/compat";
import { Loader2, Plus } from "lucide-react";

import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { useInfiniteLoadPrompts } from "@/data/ts-queries/prompt";
import { CallbackFn } from "@/data/types/domain/common";
import { DPrompt } from "@/data/types/domain/prompt";

import { Filters, PromptFilters } from "./prompt-filters";
import { PromptListItem } from "./prompt-list-item";

type PromptsListProps = {
   addPrompt: CallbackFn;
   selectPrompt: (prompt: DPrompt) => void;
   selectedPrompt: DPrompt | null;
};

export const PromptsList: FC<PromptsListProps> = ({
   addPrompt,
   selectPrompt,
   selectedPrompt,
}) => {
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
            <button
               onClick={addPrompt}
               className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
               <Plus className="w-4 h-4" />
            </button>
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
                  return (
                     <PromptListItem
                        key={prompt.id}
                        prompt={prompt}
                        isSelected={prompt.id == selectedPrompt?.id}
                        selectPrompt={selectPrompt}
                     />
                  );
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
