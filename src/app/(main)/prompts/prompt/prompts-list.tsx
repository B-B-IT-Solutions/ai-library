"use client";

import { FC, useState } from "react";
import { Clock, Filter, Plus, Search, Star } from "lucide-react";

import { CallbackFn } from "@/data/types/domain/common";
import { DPrompt } from "@/data/types/domain/prompt";

type PromptsListProps = {
   addPrompt: CallbackFn;
   selectPrompt: (prompt: DPrompt) => void;
   prompts: DPrompt[];
   selectedPrompt: DPrompt | null;
};

export const PromptsList: FC<PromptsListProps> = ({
   addPrompt,
   prompts,
   selectPrompt,
   selectedPrompt,
}) => {
   const [categories, setCategories] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("all");

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   return (
      <div className="lg:col-span-1 space-y-4">
         {/* Search and Filter */}
         <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="relative mb-4">
               <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
               <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

         {/* Prompts List */}
         <div className="bg-white rounded-lg border border-slate-200 shadow-sm max-h-[600px] overflow-y-auto">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
               <h2 className="font-semibold text-slate-900">
                  Prompts ({prompts.length})
               </h2>
               <button
                  onClick={addPrompt}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
               >
                  <Plus className="w-4 h-4" />
               </button>
            </div>

            <div className="divide-y divide-slate-200">
               {prompts.map((prompt) => (
                  <div
                     key={prompt.id}
                     onClick={() => selectPrompt(prompt)}
                     className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                        selectedPrompt?.id === prompt.id
                           ? "bg-blue-50 border-l-4 border-l-blue-600"
                           : ""
                     }`}
                  >
                     <div className="flex items-start justify-between">
                        <div className="flex-1">
                           <h3 className="font-medium mb-1 text-slate-900">
                              {prompt.title}
                           </h3>
                           <div className="flex flex-wrap gap-1 mb-2">
                              {prompt.categories.map((cat) => (
                                 <span
                                    key={cat}
                                    className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200"
                                 >
                                    {cat}
                                 </span>
                              ))}
                           </div>
                           <div className="text-xs text-slate-500 flex items-center gap-3">
                              <span className="font-medium">
                                 v{prompt.currentVersion}
                              </span>
                              {prompt.recommendedModel && (
                                 <span className="flex items-center gap-1 text-blue-600 font-medium">
                                    🤖 {prompt.recommendedModel}
                                 </span>
                              )}
                              <span className="flex items-center gap-1">
                                 <Clock className="w-3 h-3" />
                                 {formatDate(prompt.updatedAt)}
                              </span>
                           </div>
                        </div>
                        <button
                           onClick={(e) => {
                              e.stopPropagation();
                              // toggleFavorite(prompt.id);
                           }}
                           className="ml-2 p-1 hover:bg-slate-100 rounded transition-colors"
                           title={
                              prompt.isFavorite
                                 ? "Remove from favorites"
                                 : "Add to favorites"
                           }
                        >
                           <Star
                              className={`w-5 h-5 ${
                                 prompt.isFavorite
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-400"
                              }`}
                           />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};
