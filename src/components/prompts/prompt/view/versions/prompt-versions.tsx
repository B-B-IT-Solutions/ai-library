"use client";

import { FC, useState } from "react";
import { isEmpty, map, reverse } from "es-toolkit/compat";
import { ChevronDown, ChevronLeft, History } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Separator } from "@/components/shadcn/separator";
import { DPromptDescriptor, DPromptVersion } from "@/data/types/domain/prompt";

import { PromptVersion } from "./prompt-version";

type PromptVersionsProps = {
   prompt: DPromptDescriptor;
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

   const promptVersion = (version: DPromptVersion, index: number) => {
      return (
         <PromptVersion version={version} isCurrent={index === 0} key={index} />
      );
   };

   const content = () => {
      if (expanded) {
         return (
            <div className="space-y-2 mt-3">
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
               className="w-full flex items-center justify-between py-2 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
               data-testid="expand-btn"
            >
               <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
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
