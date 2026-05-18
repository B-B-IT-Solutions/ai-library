"use client";

import { useState, useTransition } from "react";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";

import { UseTemplateDialog } from "@/components/prompt-templates";
import { Button } from "@/components/shadcn/button";
import { getPublicPromptGenerationData } from "@/data/actions/prompt";
import { DPrompt, DPromptGenerationData } from "@/data/types/domain/prompt";
import { cn } from "@/lib/utils";

type Props = {
   descriptor: DPrompt;
   className?: string;
};

export const PublicUseTemplateButton = ({ descriptor, className }: Props) => {
   const [isPending, startTransition] = useTransition();

   const [templateData, setTemplateData] =
      useState<DPromptGenerationData | null>(null);

   const handleUseTemplate = async () => {
      startTransition(async () => {
         const data = await getPublicPromptGenerationData(descriptor.id);
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
            <UseTemplateDialog
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
               <Loader className="mr-1.5 h-4 w-4 animate-spin" />
               <span>Anwenden...</span>
            </>
         );
      }

      return (
         <>
            <Plus className="mr-1.5 h-4 w-4" />
            <span>Prompt anwenden</span>
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
               "cursor-pointer bg-blue-600 text-white hover:bg-blue-700",
               className
            )}
            data-testid="public-use-template-btn"
         >
            {label()}
         </Button>
         {dialog()}
      </>
   );
};
