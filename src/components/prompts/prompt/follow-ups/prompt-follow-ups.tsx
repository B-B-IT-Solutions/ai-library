"use client";

import { FC, useState } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import { ChevronDown, ChevronRight, MessageSquarePlus } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Separator } from "@/components/shadcn/separator";
import { DPromptFollowUp } from "@/data/types/domain/prompt";

import { PromptFollowUp } from "./prompt-follow-up";

type PromptFollowUpsProps = {
   followUps: DPromptFollowUp[];
};

export const PromptFollowUps: FC<PromptFollowUpsProps> = ({ followUps }) => {
   const [expanded, setExpanded] = useState(false);

   if (isEmpty(followUps)) {
      return null;
   }

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
         <ChevronRight
            className="h-5 w-5 text-slate-600"
            data-testid="chevron-right"
         />
      );
   };

   const content = () => {
      if (expanded) {
         return (
            <div className="space-y-2 mt-3">
               {map(followUps, (followUp) => (
                  <PromptFollowUp key={followUp.id} followUp={followUp} />
               ))}
            </div>
         );
      }
   };

   return (
      <>
         <Separator />
         <div data-testid="prompt-follow-ups">
            <button
               onClick={() => setExpanded((prev) => !prev)}
               className="w-full flex items-center justify-between py-2 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
               data-testid="expand-btn"
            >
               <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                     <MessageSquarePlus className="h-5 w-5 text-indigo-600" />
                     Folge-Prompts
                  </h3>
                  <Badge variant="secondary">{followUps.length}</Badge>
               </div>
               {expandIcon()}
            </button>
            {content()}
         </div>
      </>
   );
};
