"use client";

import { useState, useTransition } from "react";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";

import { CreatePromptFromTemplateDialog } from "@/components/prompt-templates";
import { CreatePromptDialog } from "@/components/prompts";
import { Button } from "@/components/shadcn/button";
import {
   composePromptFromTemplate,
   getPromptGenerationTemplateData,
} from "@/data/actions/template";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateDescriptor,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";
import { cn } from "@/lib/utils";

type Props = {
   descriptor: DPromptTemplateDescriptor;
   className?: string;
};

type Mode = "fields-form" | "review";

export const UseTemplateButton = ({ descriptor, className }: Props) => {
   const [isPending, startTransition] = useTransition();
   const [mode, setMode] = useState<Mode | null>(null);
   const [templateData, setTemplateData] =
      useState<DPromptTemplateDataPromptGeneration | null>(null);
   const [generatedPrompt, setGeneratedPrompt] = useState<DPromptUpdate | null>(
      null
   );

   const handleCreate = async () => {
      startTransition(async () => {
         const data = await getPromptGenerationTemplateData(
            descriptor.promptTemplateId
         );
         if (data) {
            setTemplateData(data);
            setMode("fields-form");
         } else {
            toast.error("Vorlage konnte nicht geladen werden");
         }
      });
   };

   const handleCancel = () => {
      setMode(null);
      setGeneratedPrompt(null);
   };

   const composePrompt = async (values: DPromptTemplateFieldValues) => {
      startTransition(async () => {
         const result = await composePromptFromTemplate(descriptor.id, values);
         if (result.success && result.data) {
            setMode("review");
            setGeneratedPrompt(result.data);
         } else {
            toast.error(result.message);
         }
      });
   };

   const dialog = () => {
      if (mode === "review" && generatedPrompt) {
         return (
            <CreatePromptDialog
               onCancel={handleCancel}
               promptUpdate={generatedPrompt}
            />
         );
      }
      if (mode === "fields-form" && templateData) {
         return (
            <CreatePromptFromTemplateDialog
               onSubmit={composePrompt}
               onCancel={handleCancel}
               descriptor={descriptor}
               templateData={templateData}
            />
         );
      }
   };

   const label = () => {
      if (isPending) {
         return (
            <>
               <Loader className="mr-1.5 h-4 w-4 animate-spin" />
               <span>Erstellen...</span>
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
            onClick={handleCreate}
            disabled={isPending}
            className={cn(
               "cursor-pointer bg-blue-600 text-white hover:bg-blue-700",
               className
            )}
            data-testid="use-template-btn"
         >
            {label()}
         </Button>
         {dialog()}
      </>
   );
};
