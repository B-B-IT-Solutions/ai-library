import { FC, useTransition } from "react";
import { Clock, Loader, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { DPrompt } from "@/data/types/domain/prompt";
import { formatDateTime } from "@/lib/utils";

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
   const [isPending, startTransition] = useTransition();

   const toggleFavorite = () => {
      startTransition(async () => {
         toast("Prompt added to favorite");
      });
   };

   const addFavoriteBtn = () => {
      return (
         <Button
            onClick={(e) => {
               e.stopPropagation();
               toggleFavorite();
            }}
            className="ml-2 p-1 bg-background hover:bg-slate-100 rounded transition-colors"
            title={
               prompt.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            data-testid="toggle-favorite-btn"
         >
            {isPending ? (
               <Loader className="w-4 h-4 animate-spin" />
            ) : (
               <Star
                  className={`w-5 h-5 ${
                     prompt.isFavorite
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-400"
                  }`}
               />
            )}
         </Button>
      );
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
                  {prompt.categories.map((cat, idx) => (
                     <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200"
                     >
                        {cat.name}
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
                     {formatDateTime(prompt.updatedAt).dateTime}
                  </span>
               </div>
            </div>
            {addFavoriteBtn()}
         </div>
      </div>
   );
};
