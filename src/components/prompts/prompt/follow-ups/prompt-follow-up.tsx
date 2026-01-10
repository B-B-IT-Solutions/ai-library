"use client";

import { FC, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DPromptFollowUp } from "@/data/types/domain/prompt";
import { CopyPromptFollowUpButton } from "../../buttons";

type PromptFollowUpProps = {
   followUp: DPromptFollowUp;
};

export const PromptFollowUp: FC<PromptFollowUpProps> = ({ followUp }) => {
   const [copied, setCopied] = useState(false);

   const copyToClipboard = async (content: string) => {
      try {
         await navigator.clipboard.writeText(content);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (error) {
         console.error("Failed to copy:", error);
      }
   };

   return (
      <div
         key={followUp.id}
         className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
         data-testid="prompt-follow-up"
      >
         <span className="text-sm text-slate-700 flex-1">
            {followUp.content}
         </span>
         <Button
            onClick={() => copyToClipboard(followUp.content)}
            className="ml-3 p-2 bg-white hover:bg-slate-200 rounded transition-colors"
            title="Copy to clipboard"
         >
            {copied ? (
               <Check className="w-4 h-4 text-green-600" />
            ) : (
               <Copy className="w-4 h-4 text-slate-600" />
            )}
         </Button>
         <CopyPromptFollowUpButton followUp={followUp} />
      </div>
   );
};
