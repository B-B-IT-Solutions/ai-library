"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Copy } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { MDRenderer } from "@/components/shared/md";
import { DPromptTemplate } from "@/data/types/domain/prompt.template";
import { cn } from "@/lib/utils";

type Props = {
   template: DPromptTemplate;
};

export const PromptTextDisplay = ({ template }: Props) => {
   const [expanded, setExpanded] = useState(true);
   const [copied, setCopied] = useState(false);

   const toggleExpanded = () => {
      setExpanded((prev) => !prev);
   };

   const copyToClipboard = async () => {
      try {
         await navigator.clipboard.writeText(template.content);
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
               <ChevronDown className="h-5 w-5 text-slate-600" />
            ) : (
               <ChevronRight className="h-5 w-5 text-slate-600" />
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
      );
   };

   const content = () => {
      if (expanded) {
         return (
            <div
               className="rounded-b-lg border border-t-0 border-slate-200 bg-white p-4"
               data-testid="content"
            >
               <MDRenderer>{template.content}</MDRenderer>
            </div>
         );
      }
   };

   return (
      <div data-testid="prompt-text">
         <div
            onClick={toggleExpanded}
            className={cn(
               "flex w-full cursor-pointer items-center justify-between border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100",
               expanded ? "rounded-t-lg" : "rounded-lg"
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
