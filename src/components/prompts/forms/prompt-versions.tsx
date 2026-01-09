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
      <section data-testid="prompt-versions">
         <button
            onClick={() => setExpanded((prev) => !prev)}
            className="w-full flex items-center justify-between py-2 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
            data-testid="versions-toggle"
         >
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
               {expanded ? (
                  <ChevronDown className="h-5 w-5 text-slate-600" />
               ) : (
                  <ChevronRight className="h-5 w-5 text-slate-600" />
               )}
               <History className="h-5 w-5 text-indigo-600" />
               Version History
            </h3>
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
      </section>
   );
};
