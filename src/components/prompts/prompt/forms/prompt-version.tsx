"use client";

import { FC, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@/components/shadcn/button";
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

   const toggleExpanded = () => {
      setExpanded((prev) => !prev);
   };

   return (
      <div data-testid="prompt-version">
         <div
            key={version.version}
            className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden"
         >
            <Button
               onClick={toggleExpanded}
               className="w-full p-4 flex justify-between items-center bg-slate-100 hover:bg-slate-200 transition-colors"
               data-testid="expand-btn"
            >
               <div className="flex items-center gap-3">
                  {expanded ? (
                     <ChevronDown
                        className="w-4 h-4 text-slate-600"
                        data-testid="chevron-down"
                     />
                  ) : (
                     <ChevronRight
                        className="w-4 h-4 text-slate-600"
                        data-testid="chevron-right"
                     />
                  )}
                  <span className="font-medium text-slate-900">
                     Version {version.version}
                  </span>
                  {isCurrent && (
                     <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs border border-green-200">
                        Current
                     </span>
                  )}
               </div>
               <span className="text-sm text-slate-600">
                  {formatDateTime(version.createdAt).dateTime}
               </span>
            </Button>

            {expanded && (
               <div className="p-4 border-t border-slate-200 bg-white">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                     {version.content}
                  </pre>
               </div>
            )}
         </div>
      </div>
   );
};
