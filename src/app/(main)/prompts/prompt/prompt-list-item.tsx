import { FC } from "react";
import { Clock, Star } from "lucide-react";

import { DPrompt } from "@/data/types/domain/prompt";

type PromptListItemProps = {
   prompt: DPrompt;
   isSelected: boolean;
   selectPrompt: (prompt: DPrompt) => void;
};

export const PromptListItem: FC<PromptListItemProps> = ({
   prompt,
   isSelected,
   selectPrompt,
}) => {
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
      <div
         key={prompt.id}
         onClick={() => selectPrompt(prompt)}
         className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${
            isSelected ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
         }`}
         data-testid="prompt-list-item"
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
                  <span className="font-medium">v{prompt.currentVersion}</span>
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
   );
};
