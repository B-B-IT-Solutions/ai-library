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
import { cn } from "@/lib/utils";

type CopyPromptButtonProps = {
   prompt: DPromptDescriptor;
   size: "sm" | "icon-sm";
   showLabel?: boolean;
   className?: string;
};

export const CopyPromptButton: FC<CopyPromptButtonProps> = ({
   prompt: prompt,
   size,
   showLabel,
   className,
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

   const label = () => {
      if (showLabel) {
         const l = copied ? "Kopiert" : "Kopieren";
         return (
            <>
               {icon()}
               <span>{l}</span>
            </>
         );
      }
      return icon();
   };

   return (
      <Tooltip>
         <TooltipTrigger asChild={true}>
            <Button
               variant="outline"
               size={size}
               onClick={copyToClipboard}
               className={cn("cursor-pointer", className)}
               data-testid="copy-prompt-btn"
            >
               {label()}
            </Button>
         </TooltipTrigger>
         <TooltipContent>
            {copied ? "Kopiert!" : "Prompt in Zwischenablage kopieren"}
         </TooltipContent>
      </Tooltip>
   );
};
