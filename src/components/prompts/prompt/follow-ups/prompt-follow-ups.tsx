"use client";

import { FC, useState } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import { Check, ChevronDown, ChevronRight, Copy, MessageSquarePlus } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { DPromptFollowUp } from "@/data/types/domain/prompt";

type PromptFollowUpsProps = {
   followUps: DPromptFollowUp[];
};

export const PromptFollowUps: FC<PromptFollowUpsProps> = ({ followUps }) => {
   const [expanded, setExpanded] = useState(false);
   const [copiedId, setCopiedId] = useState<string | null>(null);

   const copyToClipboard = async (content: string, id: string) => {
      try {
         await navigator.clipboard.writeText(content);
         setCopiedId(id);
         setTimeout(() => setCopiedId(null), 2000);
      } catch (error) {
         console.error("Failed to copy:", error);
      }
   };

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
                  <div
                     key={followUp.id}
                     className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                     <span className="text-sm text-slate-700 flex-1">
                        {followUp.content}
                     </span>
                     <Button
                        onClick={() =>
                           copyToClipboard(followUp.content, followUp.id)
                        }
                        className="ml-3 p-2 bg-white hover:bg-slate-200 rounded transition-colors"
                        title="Copy to clipboard"
                     >
                        {copiedId === followUp.id ? (
                           <Check className="w-4 h-4 text-green-600" />
                        ) : (
                           <Copy className="w-4 h-4 text-slate-600" />
                        )}
                     </Button>
                  </div>
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
               <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  {expandIcon()}
                  <MessageSquarePlus className="h-5 w-5 text-indigo-600" />
                  Folge-Prompts
               </h3>
               <Badge variant="secondary">{followUps.length}</Badge>
            </button>
            {content()}
         </div>
      </>
   );
};
