"use client";

import { FC, useState } from "react";
import { Calendar, ChevronDown, ChevronRight } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { DPromptVersion } from "@/data/types/domain/prompt";
import { formatDateTime } from "@/lib/utils";

type PromptVersionProps = {
   version: DPromptVersion;
   isCurrent: boolean;
};

export const PromptVersion: FC<PromptVersionProps> = ({
   version,
   isCurrent,
}) => {
   const [expanded, setExpanded] = useState(false);

   return (
      <div
         data-testid="prompt-version"
         className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden"
      >
         <button
            onClick={() => setExpanded((prev) => !prev)}
            className="w-full px-4 py-3 flex items-center justify-between gap-4 hover:bg-slate-100 transition-colors text-left"
            data-testid="expand-btn"
         >
            <div className="flex items-center gap-3 min-w-0">
               {expanded ? (
                  <ChevronDown
                     className="h-4 w-4 shrink-0 text-slate-600"
                     data-testid="chevron-down"
                  />
               ) : (
                  <ChevronRight
                     className="h-4 w-4 shrink-0 text-slate-600"
                     data-testid="chevron-right"
                  />
               )}
               <span className="font-medium text-slate-900">
                  v{version.version}
               </span>
               {isCurrent && <Badge>Current</Badge>}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 shrink-0">
               <Calendar className="h-3.5 w-3.5" />
               <span>{formatDateTime(version.createdAt).dateTime}</span>
            </div>
         </button>

         {expanded && (
            <div className="px-4 pb-4 pt-2 border-t border-slate-200 bg-white">
               <pre className="whitespace-pre-wrap text-sm font-mono text-slate-700">
                  {version.content}
               </pre>
            </div>
         )}
      </div>
   );
};
