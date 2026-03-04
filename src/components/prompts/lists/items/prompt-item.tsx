"use client";

import { isEmpty } from "es-toolkit/compat";
import { Clock, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DPromptDescriptor } from "@/data/types/domain/prompt";
import { formatDateTime } from "@/lib/utils";

type Props = {
   prompt: DPromptDescriptor;
};

export const PromptItem = ({ prompt }: Props) => {
   const pathname = usePathname();

   const href = `/prompts/${prompt.id}`;
   const isSelected = pathname.startsWith(href);

   const isFavorite = () => {
      return (
         <div data-testid="is-favorite">
            <Star
               className={`h-4 w-4 transition-all ${
                  prompt.isFavorite
                     ? "scale-110 fill-yellow-400 text-yellow-500"
                     : "text-slate-400"
               }`}
            />
         </div>
      );
   };

   const categories = () => {
      if (!isEmpty(prompt.categories)) {
         return (
            <div
               className="mb-2.5 flex flex-wrap gap-1.5"
               data-testid="categories"
            >
               {prompt.categories.slice(0, 2).map((cat, idx) => (
                  <span
                     key={idx}
                     className="rounded-md border border-slate-200/50 bg-gradient-to-r from-slate-100 to-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700"
                  >
                     {cat.name}
                  </span>
               ))}
               {prompt.categories.length > 2 && (
                  <span className="px-2 py-0.5 text-xs font-medium text-slate-500">
                     +{prompt.categories.length - 2} mehr
                  </span>
               )}
            </div>
         );
      }
   };

   return (
      <Link href={href}>
         <div
            className={`group relative cursor-pointer rounded-lg border transition-all duration-200 ${
               isSelected
                  ? "border-blue-200 bg-blue-50/60 shadow-md"
                  : "border-slate-200/60 bg-white hover:border-slate-300 hover:shadow-md"
            }`}
            data-testid="prompt-list-item"
         >
            {isSelected && (
               <div className="absolute top-0 bottom-0 left-0 w-1 rounded-l-lg bg-gradient-to-b from-blue-500 to-blue-600" />
            )}
            <div className="flex items-start gap-3 px-4 py-3.5">
               <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                     <h3 className="flex-1 truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-700">
                        {prompt.title}
                     </h3>
                     {isFavorite()}
                  </div>
                  {categories()}
                  <div className="flex items-center justify-end gap-2.5 text-xs text-slate-500">
                     <span className="inline-flex items-center gap-1.5 truncate">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                        <span className="font-medium">
                           {formatDateTime(prompt.updatedAt).dateOnly}
                        </span>
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </Link>
   );
};
