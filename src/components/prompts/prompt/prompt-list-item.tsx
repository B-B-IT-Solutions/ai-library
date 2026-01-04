"use client";

import { FC, useTransition } from "react";
import { Clock, Loader, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { toggleFavorite } from "@/data/actions/prompt";
import { DPromptDescriptor } from "@/data/types/domain/prompt";
import { formatDateTime } from "@/lib/utils";

type PromptListItemProps = {
   prompt: DPromptDescriptor;
};

export const PromptListItem: FC<PromptListItemProps> = ({ prompt }) => {
   const [isPending, startTransition] = useTransition();
   const pathname = usePathname();

   const href = `/prompts/${prompt.id}`;
   const isSelected = pathname.startsWith(href);

   const handleToggleFavorite = () => {
      startTransition(async () => {
         const result = await toggleFavorite(prompt.id, !prompt.isFavorite);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
      });
   };

   const addFavoriteBtn = () => {
      return (
         <Button
            onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               handleToggleFavorite();
            }}
            size="sm"
            variant="ghost"
            className={`h-6 w-6 p-0 flex-shrink-0 ${
               prompt.isFavorite
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
            } transition-opacity`}
            title={
               prompt.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            data-testid="toggle-favorite-btn"
            disabled={isPending}
         >
            {isPending ? (
               <Loader className="w-3.5 h-3.5 animate-spin text-slate-400" />
            ) : (
               <Star
                  className={`w-3.5 h-3.5 ${
                     prompt.isFavorite
                        ? "fill-yellow-400 text-yellow-500"
                        : "text-slate-400 hover:text-yellow-500"
                  }`}
               />
            )}
         </Button>
      );
   };

   return (
      <Link href={href}>
         <div
            className={`group px-4 py-3 cursor-pointer transition-all border-l-2 hover:bg-slate-50 ${
               isSelected
                  ? "bg-blue-50 border-l-blue-600"
                  : "border-l-transparent"
            }`}
            data-testid="prompt-list-item"
         >
            <div className="flex items-start gap-3">
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                     <h3 className="font-medium text-sm text-slate-900 truncate flex-1">
                        {prompt.title}
                     </h3>
                     {addFavoriteBtn()}
                  </div>

                  {prompt.categories.length > 0 && (
                     <div className="flex flex-wrap gap-1 mb-1.5">
                        {prompt.categories.slice(0, 2).map((cat, idx) => (
                           <span
                              key={idx}
                              className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded"
                           >
                              {cat.name}
                           </span>
                        ))}
                        {prompt.categories.length > 2 && (
                           <span className="text-xs px-1.5 py-0.5 text-slate-500">
                              +{prompt.categories.length - 2}
                           </span>
                        )}
                     </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                     <span className="inline-flex items-center gap-1">
                        <span className="font-medium">v{prompt.currentVersion}</span>
                     </span>
                     <span className="text-slate-300">•</span>
                     <span className="inline-flex items-center gap-1 truncate">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        {formatDateTime(prompt.updatedAt).dateTime}
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </Link>
   );
};
