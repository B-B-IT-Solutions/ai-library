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
         className="rounded-lg border bg-card overflow-hidden"
      >
         <button
            onClick={() => setExpanded((prev) => !prev)}
            className="w-full px-4 py-3 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors text-left"
            data-testid="expand-btn"
         >
            <div className="flex items-center gap-3 min-w-0">
               {expanded ? (
                  <ChevronDown
                     className="size-4 shrink-0 text-muted-foreground"
                     data-testid="chevron-down"
                  />
               ) : (
                  <ChevronRight
                     className="size-4 shrink-0 text-muted-foreground"
                     data-testid="chevron-right"
                  />
               )}
               <span className="font-medium text-foreground">
                  v{version.version}
               </span>
               {isCurrent && <Badge>Current</Badge>}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
               <Calendar className="size-3.5" />
               <span>{formatDateTime(version.createdAt).dateTime}</span>
            </div>
         </button>

         {expanded && (
            <div className="px-4 pb-4 pt-2 border-t bg-muted/30">
               <pre className="whitespace-pre-wrap text-sm font-mono text-foreground">
                  {version.content}
               </pre>
            </div>
         )}
      </div>
   );
};
