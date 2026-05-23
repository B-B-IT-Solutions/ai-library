"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { MDRenderer } from "@/components/shared/md";
import { DPromptWithContent } from "@/data/types/domain/prompt";

type Props = {
   template: DPromptWithContent;
};

export const PromptTextDisplay = ({ template }: Props) => {
   const [copied, setCopied] = useState(false);

   const copyToClipboard = async () => {
      try {
         await navigator.clipboard.writeText(template.content);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (error) {
         console.error("Failed to copy:", error);
      }
   };

   return (
      <div data-testid="prompt-text">
         <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
               Prompt-Text
            </span>
            <Button
               onClick={copyToClipboard}
               variant="ghost"
               size="sm"
               className="h-8 px-3 hover:bg-slate-200"
               title="In Zwischenablage kopieren"
               data-testid="copy-btn"
            >
               {copied ? (
                  <>
                     <Check className="mr-2 h-4 w-4 text-green-600" />
                     <span className="text-sm text-green-600">Kopiert!</span>
                  </>
               ) : (
                  <>
                     <Copy className="mr-2 h-4 w-4 text-slate-600" />
                     <span className="text-sm text-slate-600">Kopieren</span>
                  </>
               )}
            </Button>
         </div>
         <div className="rounded-lg bg-slate-950 p-5">
            <MDRenderer className="font-mono text-sm leading-relaxed text-slate-100">
               {template.content}
            </MDRenderer>
         </div>
      </div>
   );
};
