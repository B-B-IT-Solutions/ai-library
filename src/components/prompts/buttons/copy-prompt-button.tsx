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

type CopyPromptButtonProps = {
   prompt: DPromptDescriptor;
};

export const CopyPromptButton: FC<CopyPromptButtonProps> = ({
   prompt: prompt,
}) => {
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

   const icon = () => {
      if (copied) {
         return (
            <Check className="size-4 text-green-600" data-testid="check-icon" />
         );
      }
      return <Copy className="size-4" data-testid="copy-icon" />;
   };

   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <Button
               variant="outline"
               size="icon-sm"
               onClick={copyToClipboard}
               className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white cursor-pointer"
               data-testid="copy-prompt-btn"
            >
               {icon()}
            </Button>
         </TooltipTrigger>
         <TooltipContent>
            {copied ? "Kopiert!" : "Prompt in Zwischenablage kopieren"}
         </TooltipContent>
      </Tooltip>
   );
};
