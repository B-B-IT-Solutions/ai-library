"use client";

import { FC, useState } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import { ChevronDown, ChevronLeft, MessageSquarePlus } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Separator } from "@/components/shadcn/separator";
import { DPrompt0 } from "@/data/types/domain/prompt";

import { PromptFollowUp } from "./prompt-follow-up-view";

type PromptFollowUpsProps = {
   prompt: DPrompt0;
};

export const PromptFollowUps: FC<PromptFollowUpsProps> = ({ prompt }) => {
   const [expanded, setExpanded] = useState(false);

   const { followUpPrompts: followUps } = prompt;

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
         <ChevronLeft
            className="h-5 w-5 text-slate-600"
            data-testid="chevron-left"
         />
      );
   };

   const content = () => {
      if (expanded) {
         return (
            <div className="mt-3 space-y-2">
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
               className="-mx-2 flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-slate-50"
               data-testid="expand-btn"
            >
               <div className="flex items-center gap-2">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
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
