"use client";

import { FC, useState } from "react";
import { Check, ChevronDown, ChevronRight, Copy } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { cn } from "@/lib/utils";

type PromptTextDisplayProps = {
   content: string;
};

export const PromptTextDisplay: FC<PromptTextDisplayProps> = ({ content }) => {
   const [expanded, setExpanded] = useState(true);
   const [copied, setCopied] = useState(false);

   const toggleExpanded = () => {
      setExpanded((prev) => !prev);
   };

   const copyToClipboard = async () => {
      try {
         await navigator.clipboard.writeText(content);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (error) {
         console.error("Failed to copy:", error);
      }
   };

   return (
      <div>
         <div
            onClick={toggleExpanded}
            // className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-t-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            className={cn(
               "w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer",
               expanded ? "rounded-t-lg " : "rounded-lg "
            )}
         >
            <div className="flex items-center gap-2">
               {expanded ? (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
               ) : (
                  <ChevronRight className="w-5 h-5 text-slate-600" />
               )}
               <span className="font-semibold text-slate-900">Prompt-Text</span>
            </div>
            <Button
               onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard();
               }}
               variant="ghost"
               size="sm"
               className="h-8 px-3 hover:bg-slate-200"
               title="In Zwischenablage kopieren"
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
         </div>

         {expanded && (
            <div className="p-4 bg-white border border-t-0 border-slate-200 rounded-b-lg">
               <pre className="text-sm text-slate-800 whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto">
                  {content}
               </pre>
            </div>
         )}
      </div>
   );
};
