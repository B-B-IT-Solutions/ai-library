"use client";

import { useState, useTransition } from "react";
import { Loader, Zap } from "lucide-react";
import { toast } from "sonner";

import { UsePromptDialog } from "@/components/prompt-templating";
import { Button } from "@/components/shadcn/button";
import { getPromptGenerationData } from "@/data/actions/prompt";
import { DPrompt, DPromptGenerationData } from "@/data/types/domain/prompt";
import { cn } from "@/lib/utils";

type Props = {
   descriptor: DPrompt;
   className?: string;
};

export const UseTemplateButton = ({ descriptor, className }: Props) => {
   const [isPending, startTransition] = useTransition();

   const [templateData, setTemplateData] =
      useState<DPromptGenerationData | null>(null);

   const handleUseTemplate = async () => {
      startTransition(async () => {
         const data = await getPromptGenerationData(descriptor.id);
         if (data) {
            setTemplateData(data);
         } else {
            toast.error("Vorlage konnte nicht geladen werden");
         }
      });
   };

   const handleCancel = () => {
      setTemplateData(null);
   };

   const dialog = () => {
      if (templateData) {
         return (
            <UsePromptDialog
               prompt={descriptor}
               generationData={templateData}
               onCancel={handleCancel}
            />
         );
      }
   };

   const label = () => {
      if (isPending) {
         return (
            <>
               <Loader className="mr-1 h-4 w-4 animate-spin" />
               <span>Anwenden...</span>
            </>
         );
      }

      return (
         <>
            <Zap className="mr-1 h-4 w-4" />
            <span>Anwenden</span>
         </>
      );
   };

   return (
      <>
         <Button
            variant="default"
            size="sm"
            onClick={handleUseTemplate}
            disabled={isPending}
            className={cn(
               "cursor-pointer bg-blue-700 text-white hover:bg-blue-800",
               className
            )}
            data-testid="use-prompt-btn"
         >
            {label()}
         </Button>
         {dialog()}
      </>
   );
};
