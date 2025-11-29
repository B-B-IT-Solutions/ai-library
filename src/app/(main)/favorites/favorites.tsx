"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { DPrompt } from "@/data/types/domain/prompt";

export const Favorites = () => {
   const prompts: DPrompt[] = [];
   const [favorites, setFavorites] = useState<string[]>([]);

   const toggleFavorite = (promptId: string) => {
      const newFavorites = favorites.includes(promptId)
         ? favorites.filter((id) => id !== promptId)
         : [...favorites, promptId];

      setFavorites(newFavorites);
   };

   const favoritePrompts = prompts.filter((p) => favorites.includes(p.id));

   return (
      <div data-testid="favorites">
         <header className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
               Favorites
            </h2>
            <p className="text-slate-600">
               Your starred prompts for quick access
            </p>
         </header>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Favorites List */}
            <div className="lg:col-span-1">
               <div className="bg-white rounded-lg border border-slate-200 shadow-sm max-h-[600px] overflow-y-auto">
                  <div className="p-4 border-b border-slate-200 bg-slate-50">
                     <h3 className="font-semibold text-slate-900">
                        Favorite Prompts ({favoritePrompts.length})
                     </h3>
                  </div>

                  {favoritePrompts.length > 0 ? (
                     <div className="divide-y divide-slate-200">
                        {favoritePrompts.map((prompt) => (
                           <div
                              key={prompt.id}
                              onClick={() => {
                                 //  selectPrompt(prompt);
                                 //  setActiveMenu("prompts");
                              }}
                              className="p-4 cursor-pointer transition-colors hover:bg-slate-50"
                           >
                              <div className="flex items-start justify-between">
                                 <div className="flex-1">
                                    <h3 className="font-medium mb-1 text-slate-900">
                                       {prompt.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                       {prompt.categories.map((cat: string) => (
                                          <span
                                             key={cat}
                                             className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200"
                                          >
                                             {cat}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                                 <button
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       toggleFavorite(prompt.id);
                                    }}
                                    className="ml-2 p-1 hover:bg-slate-100 rounded transition-colors"
                                 >
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="p-12 text-center text-slate-500">
                        <Star className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>No favorite prompts yet</p>
                        <p className="text-sm mt-2">
                           Star prompts to add them here
                        </p>
                     </div>
                  )}
               </div>
            </div>

            <div className="lg:col-span-2">
               <div className="bg-slate-100 rounded-lg p-12 border border-slate-200 text-center">
                  <p className="text-slate-600">
                     Select a favorite prompt to view details
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};
