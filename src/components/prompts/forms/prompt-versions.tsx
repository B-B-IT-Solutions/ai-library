"use client";

import { FC, useState } from "react";
import { map, reverse } from "es-toolkit/compat";
import { ChevronDown, ChevronRight, History } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { DPromptDescriptor } from "@/data/types/domain/prompt";

import { PromptVersion } from "./prompt-version";

type PromptVersionsProps = {
   prompt: DPromptDescriptor;
};

export const PromptVersions: FC<PromptVersionsProps> = ({ prompt }) => {
   const [expanded, setExpanded] = useState(false);

   if (!prompt.versions || prompt.versions.length === 0) {
      return null;
   }

   const versions = reverse(prompt.versions);

   return (
      <div data-testid="prompt-versions">
         <button
            onClick={() => setExpanded((prev) => !prev)}
            className="w-full flex items-center justify-between py-2 hover:bg-muted/50 -mx-2 px-2 rounded-lg transition-colors"
            data-testid="versions-toggle"
         >
            <div className="flex items-center gap-2">
               {expanded ? (
                  <ChevronDown className="size-4 text-muted-foreground" />
               ) : (
                  <ChevronRight className="size-4 text-muted-foreground" />
               )}
               <History className="size-4 text-muted-foreground" />
               <span className="font-semibold text-foreground">
                  Version History
               </span>
            </div>
            <Badge variant="secondary">{prompt.versions.length}</Badge>
         </button>

         {expanded && (
            <div className="space-y-2 mt-3">
               {map(versions, (version, idx) => (
                  <PromptVersion
                     version={version}
                     isCurrent={idx === 0}
                     key={version.version}
                  />
               ))}
            </div>
         )}
      </div>
   );
};
