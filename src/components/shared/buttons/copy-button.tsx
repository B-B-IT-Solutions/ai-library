"use client";

import { FC, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
   content: string;
   size: "sm" | "icon-sm";
   showLabel?: boolean;
   className?: string;
   "data-testid"?: string;
};

export const CopyButton: FC<CopyButtonProps> = ({
   content,
   size,
   showLabel,
   className,
   "data-testid": dataTestId = "copy-btn",
}) => {
   const [copied, setCopied] = useState(false);

   const copyToClipboard = async () => {
      try {
         await navigator.clipboard.writeText(content);
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
               data-testid={dataTestId}
            >
               {label()}
            </Button>
         </TooltipTrigger>
         <TooltipContent>
            {copied ? "Kopiert!" : "In Zwischenablage kopieren"}
         </TooltipContent>
      </Tooltip>
   );
};
