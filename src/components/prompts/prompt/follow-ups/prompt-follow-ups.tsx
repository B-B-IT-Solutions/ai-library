"use client";

import { FC, useState } from "react";
import { map } from "es-toolkit/compat";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DPromptFollowUp } from "@/data/types/domain/prompt";

type PromptFollowUpsProps = {
   followUps: DPromptFollowUp[];
};

export const PromptFollowUps: FC<PromptFollowUpsProps> = ({ followUps }) => {
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

   return (
      <div className="space-y-3" data-testid="prompt-follow-ups">
         <h3 className="text-lg font-semibold text-slate-900">
            Folge-Prompts ({followUps.length})
         </h3>
         <div className="space-y-2">
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
      </div>
   );
};
