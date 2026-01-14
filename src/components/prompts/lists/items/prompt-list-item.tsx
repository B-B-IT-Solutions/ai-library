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
            className={`h-7 w-7 p-0 flex-shrink-0 rounded-md hover:bg-slate-100 ${
               prompt.isFavorite
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
            } transition-all duration-200`}
            title={
               prompt.isFavorite
                  ? "Aus Favoriten entfernen"
                  : "Zu Favoriten hinzufügen"
            }
            data-testid="toggle-favorite-btn"
            disabled={isPending}
         >
            {isPending ? (
               <Loader className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
               <Star
                  className={`w-4 h-4 transition-all ${
                     prompt.isFavorite
                        ? "fill-yellow-400 text-yellow-500 scale-110"
                        : "text-slate-400 hover:text-yellow-500 hover:scale-110"
                  }`}
               />
            )}
         </Button>
      );
   };

   return (
      <Link href={href}>
         <div
            className={`group relative rounded-lg cursor-pointer transition-all duration-200 border ${
               isSelected
                  ? "bg-blue-50/60 border-blue-200 shadow-md"
                  : "bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-md"
            }`}
            data-testid="prompt-list-item"
         >
            {isSelected && (
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-l-lg" />
            )}
            <div className="flex items-start gap-3 px-4 py-3.5">
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                     <h3 className="font-semibold text-sm text-slate-900 truncate flex-1 group-hover:text-blue-700 transition-colors">
                        {prompt.title}
                     </h3>
                     {addFavoriteBtn()}
                  </div>

                  {prompt.categories.length > 0 && (
                     <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {prompt.categories.slice(0, 2).map((cat, idx) => (
                           <span
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 rounded-md font-medium border border-slate-200/50"
                           >
                              {cat.name}
                           </span>
                        ))}
                        {prompt.categories.length > 2 && (
                           <span className="text-xs px-2 py-0.5 text-slate-500 font-medium">
                              +{prompt.categories.length - 2} mehr
                           </span>
                        )}
                     </div>
                  )}

                  <div className="flex items-center gap-2.5 text-xs text-slate-500">
                     <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 rounded-md border border-slate-200/50">
                        <span className="font-semibold text-slate-600">
                           v{prompt.currentVersion}
                        </span>
                     </span>
                     <span className="text-slate-300">•</span>
                     <span className="inline-flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                        <span className="font-medium">
                           {formatDateTime(prompt.updatedAt).dateTime}
                        </span>
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </Link>
   );
};
