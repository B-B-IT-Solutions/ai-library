"use client";

import { FC, useState } from "react";
import { Check, ChevronDown, ChevronRight, Copy } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DPrompt } from "@/data/types/domain/prompt";

type PromptContentProps = {
   prompt: DPrompt;
};

export const PromptContent: FC<PromptContentProps> = ({ prompt }) => {
   const [expanded, setExpanded] = useState(false);
   const [copied, setCopied] = useState(false);

   const toggleExpanded = () => {
      setExpanded((prev) => !prev);
   };

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
      <div data-testid="prompt-content">
         <div
            onClick={toggleExpanded}
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
            data-testid="expand-toggle"
         >
            <span className="font-semibold text-slate-900 flex items-center gap-2">
               Current Prompt Content
            </span>
            <div className="flex items-center gap-2">
               <Button
                  onClick={(e) => {
                     e.stopPropagation();
                     copyToClipboard();
                  }}
                  className="p-2 bg-slate-50 hover:bg-slate-200 rounded transition-colors"
                  title="Copy to clipboard"
                  data-testid="copy-btn"
               >
                  {copied ? (
                     <Check
                        className="w-4 h-4 text-green-600"
                        data-testid="check-icon"
                     />
                  ) : (
                     <Copy
                        className="w-4 h-4 text-slate-600"
                        data-testid="copy-icon"
                     />
                  )}
               </Button>
               {expanded ? (
                  <ChevronDown
                     className="w-5 h-5 text-slate-600"
                     data-testid="chevron-down"
                  />
               ) : (
                  <ChevronRight
                     className="w-5 h-5 text-slate-600"
                     data-testid="chevron-right"
                  />
               )}
            </div>
         </div>

         {expanded && (
            <div className="mt-2 p-4 bg-white border border-slate-200 rounded-lg">
               <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                  {prompt.content}
               </pre>
            </div>
         )}
      </div>
   );
};
