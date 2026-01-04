"use client";

import { FC, useState } from "react";
import { Check, ChevronDown, ChevronRight, Copy } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DPromptTemplate } from "@/data/types/domain/prompt.template";
import { cn } from "@/lib/utils";

type PromptTextDisplayProps = {
   template: DPromptTemplate;
};

export const PromptTextDisplay: FC<PromptTextDisplayProps> = ({ template }) => {
   const [expanded, setExpanded] = useState(true);
   const [copied, setCopied] = useState(false);

   const toggleExpanded = () => {
      setExpanded((prev) => !prev);
   };

   const copyToClipboard = async () => {
      try {
         await navigator.clipboard.writeText(template.promptText);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (error) {
         console.error("Failed to copy:", error);
      }
   };

   const headline = () => {
      return (
         <div className="flex items-center gap-2" data-testid="headline">
            {expanded ? (
               <ChevronDown className="w-5 h-5 text-slate-600" />
            ) : (
               <ChevronRight className="w-5 h-5 text-slate-600" />
            )}
            <span className="font-semibold text-slate-900">Prompt-Text</span>
         </div>
      );
   };

   const copyBtn = () => {
      return (
         <Button
            onClick={(e) => {
               e.stopPropagation();
               copyToClipboard();
            }}
            variant="ghost"
            size="sm"
            className="h-8 px-3 hover:bg-slate-200"
            title="In Zwischenablage kopieren"
            data-testid="copy-btn"
         >
            {copied ? (
               <>
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-600">Kopiert!</span>
               </>
            ) : (
               <>
                  <Copy className="w-4 h-4 text-slate-600 mr-2" />
                  <span className="text-sm text-slate-600">Kopieren</span>
               </>
            )}
         </Button>
      );
   };

   const content = () => {
      if (expanded) {
         return (
            <div
               className="p-4 bg-white border border-t-0 border-slate-200 rounded-b-lg"
               data-testid="content"
            >
               <pre className="text-sm text-slate-800 whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto">
                  {template.promptText}
               </pre>
            </div>
         );
      }
   };

   return (
      <div data-testid="prompt-text">
         <div
            onClick={toggleExpanded}
            className={cn(
               "w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer",
               expanded ? "rounded-t-lg " : "rounded-lg "
            )}
            data-testid="expand-toggle"
         >
            {headline()}
            {copyBtn()}
         </div>
         {content()}
      </div>
   );
};
