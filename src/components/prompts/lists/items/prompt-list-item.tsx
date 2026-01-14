"use client";

import { FC } from "react";
import { isEmpty } from "es-toolkit/compat";
import { Clock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DPromptDescriptor } from "@/data/types/domain/prompt";
import { formatDateTime } from "@/lib/utils";

type PromptListItemProps = {
   prompt: DPromptDescriptor;
};

export const PromptListItem: FC<PromptListItemProps> = ({ prompt }) => {
   const pathname = usePathname();

   const href = `/prompts/${prompt.id}`;
   const isSelected = pathname.startsWith(href);

   const categories = () => {
      if (!isEmpty(prompt.categories)) {
         return (
            <div
               className="flex flex-wrap gap-1.5 mb-2.5"
               data-testid="categories"
            >
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
         );
      }
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
                  </div>
                  {categories()}
                  <div className="flex justify-end items-center gap-2.5 text-xs text-slate-500">
                     <span className="inline-flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
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
