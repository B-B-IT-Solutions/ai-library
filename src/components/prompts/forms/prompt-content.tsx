"use client";

import { FC, useState } from "react";
import { Check, Copy } from "lucide-react";

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
      <div data-testid="prompt-content" className="space-y-3">
         <h3 className="font-semibold text-foreground">Prompt Content</h3>

         <div className="group relative rounded-lg border bg-muted/50 p-4">
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button
                     variant="outline"
                     size="icon-sm"
                     onClick={copyToClipboard}
                     className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background"
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
                  {copied ? "Copied!" : "Copy to clipboard"}
               </TooltipContent>
            </Tooltip>

            <pre className="whitespace-pre-wrap text-sm font-mono text-foreground pr-10">
               {prompt.content}
            </pre>
         </div>
      </div>
   );
};
