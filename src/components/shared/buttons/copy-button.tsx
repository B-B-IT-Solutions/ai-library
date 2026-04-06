"use client";

import { ButtonHTMLAttributes, useState } from "react";
import { VariantProps } from "class-variance-authority";
import { Check, Copy } from "lucide-react";

import { Button, buttonVariants } from "@/components/shadcn/button";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { cn } from "@/lib/utils";

type ButtonVariants = VariantProps<typeof buttonVariants>;

type Props = {
   content: string;
   variant?: ButtonVariants["variant"];
   size: ButtonVariants["size"];
   showLabel?: boolean;
   type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
   className?: string;
   iconClassName?: string;
   "data-testid"?: string;
};

export const CopyButton = ({
   content,
   variant = "outline",
   size,
   showLabel,
   type = "button",
   className,
   iconClassName = "size-4",
   "data-testid": dataTestId = "copy-btn",
}: Props) => {
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
            <Check
               className={cn(iconClassName, "text-green-600")}
               data-testid="check-icon"
            />
         );
      }
      return <Copy className={cn(iconClassName)} data-testid="copy-icon" />;
   };

   const label = () => {
      if (showLabel) {
         const l = copied ? "Kopiert" : "Kopieren";
         const style = copied ? "text-green-600" : undefined;
         return (
            <>
               {icon()}
               <span className={style}>{l}</span>
            </>
         );
      }
      return icon();
   };

   return (
      <Tooltip>
         <TooltipTrigger asChild={true}>
            <Button
               variant={variant}
               size={size}
               type={type}
               onClick={copyToClipboard}
               className={cn("cursor-pointer", className)}
               data-testid={dataTestId}
            >
               {label()}
            </Button>
         </TooltipTrigger>
         <TooltipContent>
            {copied ? "Kopiert" : "In Zwischenablage kopieren"}
         </TooltipContent>
      </Tooltip>
   );
};
