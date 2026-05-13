"use client";

import { FC, useState } from "react";
import { Calendar, ChevronDown, ChevronRight } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { DPrompt0Version } from "@/data/types/domain/prompt";
import { formatDateTime } from "@/lib/utils";

type PromptVersionProps = {
   version: DPrompt0Version;
   isCurrent: boolean;
};

export const PromptVersion: FC<PromptVersionProps> = ({
   version,
   isCurrent,
}) => {
   const [expanded, setExpanded] = useState(false);

   const content = () => {
      if (expanded) {
         return (
            <div className="border-t border-slate-200 bg-white px-4 pt-2 pb-4">
               <pre className="font-mono text-sm whitespace-pre-wrap text-slate-700">
                  {version.content}
               </pre>
            </div>
         );
      }
   };

   const expandIcon = () => {
      if (expanded) {
         return (
            <ChevronDown
               className="h-4 w-4 shrink-0 text-slate-600"
               data-testid="chevron-down"
            />
         );
      }
      return (
         <ChevronRight
            className="h-4 w-4 shrink-0 text-slate-600"
            data-testid="chevron-right"
         />
      );
   };

   const currentBadge = () => {
      if (isCurrent) {
         return <Badge>Aktuell</Badge>;
      }
   };

   return (
      <div
         data-testid="prompt-version"
         className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
      >
         <button
            onClick={() => setExpanded((prev) => !prev)}
            className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-slate-100"
            data-testid="expand-btn"
         >
            <div className="flex min-w-0 items-center gap-3">
               {expandIcon()}
               <span className="font-medium text-slate-900">
                  v{version.version}
               </span>
               {currentBadge()}
            </div>
            <div className="flex shrink-0 items-center gap-2 text-sm text-slate-600">
               <Calendar className="h-3.5 w-3.5" />
               <span>{formatDateTime(version.createdAt).dateTime}</span>
            </div>
         </button>
         {content()}
      </div>
   );
};
