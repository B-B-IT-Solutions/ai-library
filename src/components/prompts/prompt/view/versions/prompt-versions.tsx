"use client";

import { FC, useState } from "react";
import { isEmpty, map, reverse } from "es-toolkit/compat";
import { ChevronDown, ChevronLeft, History } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Separator } from "@/components/shadcn/separator";
import { DPrompt0, DPrompt0Version } from "@/data/types/domain/prompt0";

import { PromptVersion } from "./prompt-version";

type PromptVersionsProps = {
   prompt: DPrompt0;
};

export const PromptVersions: FC<PromptVersionsProps> = ({ prompt }) => {
   const [expanded, setExpanded] = useState(false);

   if (isEmpty(prompt.versions)) {
      return null;
   }

   const versions = reverse(prompt.versions);

   const expandIcon = () => {
      if (expanded) {
         return (
            <ChevronDown
               className="h-5 w-5 text-slate-600"
               data-testid="chevron-down"
            />
         );
      }
      return (
         <ChevronLeft
            className="h-5 w-5 text-slate-600"
            data-testid="chevron-left"
         />
      );
   };

   const promptVersion = (version: DPrompt0Version, index: number) => {
      return (
         <PromptVersion version={version} isCurrent={index === 0} key={index} />
      );
   };

   const content = () => {
      if (expanded) {
         return (
            <div className="mt-3 space-y-2">
               {map(versions, (v, idx) => promptVersion(v, idx))}
            </div>
         );
      }
   };

   return (
      <>
         <Separator />
         <div data-testid="prompt-versions">
            <button
               onClick={() => setExpanded((prev) => !prev)}
               className="-mx-2 flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-slate-50"
               data-testid="expand-btn"
            >
               <div className="flex items-center gap-2">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                     <History className="h-5 w-5 text-indigo-600" />
                     Versionsverlauf
                  </h3>
                  <Badge variant="secondary">{versions.length}</Badge>
               </div>
               {expandIcon()}
            </button>
            {content()}
         </div>
      </>
   );
};
