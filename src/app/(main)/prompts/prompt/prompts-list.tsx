"use client";

import { FC, useState } from "react";
import { map, sum } from "es-toolkit/compat";
import { Filter, Loader2, Plus, Search } from "lucide-react";

import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { useInfiniteLoadPrompts } from "@/data/ts-queries/prompt";
import { CallbackFn } from "@/data/types/domain/common";
import { DPrompt } from "@/data/types/domain/prompt";

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
   const [categories, setCategories] = useState([]);
   const [search, setSearch] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("all");

   const {
      data: { pages = [] } = {},
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useInfiniteLoadPrompts({ search, categories });

   const count = sum(map(pages, (p) => p.pageSize));

   const promptItemsHeader = () => {
      return (
         <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
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
         <div className="divide-y divide-slate-200 max-h-[500px] overflow-y-auto">
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
               threshold={1}
            >
               {hasNextPage && (
                  <Loader2 className="my-4 h-8 w-8 animate-spin" />
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
      return (
         <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="relative mb-4">
               <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
               <input
                  type="text"
                  placeholder="Search prompts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               />
            </div>

            <div className="space-y-2">
               <label className="flex items-center text-sm text-slate-600 mb-2 font-medium">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter by Category
               </label>
               <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                     <option key={cat} value={cat}>
                        {cat}
                     </option>
                  ))}
               </select>
            </div>
         </div>
      );
   };

   return (
      <div className="lg:col-span-1 space-y-4" data-testid="prompts-list">
         {promptFilters()}
         {promptItemsList()}
      </div>
   );
};
