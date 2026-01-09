"use client";

import { FC, useState } from "react";
import { Check, Copy, FileText } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { DPromptDescriptor } from "@/data/types/domain/prompt";

type PromptContentProps = {
   prompt: DPromptDescriptor;
};

export const PromptContent: FC<PromptContentProps> = ({ prompt }) => {
   const [copied, setCopied] = useState(false);

   const copyToClipboard = async () => {
      try {
         await navigator.clipboard.writeText(prompt.content);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (error) {
         console.error("Failed to copy:", error);
      }
   };

   return (
      <section data-testid="prompt-content" className="space-y-3">
         <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Prompt-Inhalt
         </h3>

         <div className="group relative bg-slate-50 border border-slate-200 rounded-lg p-4">
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button
                     variant="outline"
                     size="icon-sm"
                     onClick={copyToClipboard}
                     className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white"
                     data-testid="copy-btn"
                  >
                     {copied ? (
                        <Check
                           className="size-4 text-green-600"
                           data-testid="check-icon"
                        />
                     ) : (
                        <Copy className="size-4" data-testid="copy-icon" />
                     )}
                  </Button>
               </TooltipTrigger>
               <TooltipContent>
                  {copied ? "Kopiert!" : "In Zwischenablage kopieren"}
               </TooltipContent>
            </Tooltip>

            <pre className="whitespace-pre-wrap text-sm font-mono text-slate-700 pr-10">
               {prompt.content}
            </pre>
         </div>
      </section>
   );
};
