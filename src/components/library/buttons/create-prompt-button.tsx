"use client";

import { FC, useState, useTransition } from "react";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";

import { CreatePromptDialog } from "@/components/prompts";
import { Button } from "@/components/shadcn/button";
import { composePromptFromTemplate } from "@/data/actions/library";
import { getPromptTemplate } from "@/data/actions/prompt";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplate,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";
import { cn } from "@/lib/utils";

type Props = {
   descriptor: DPromptTemplateDescriptor;
   className?: string;
};

type Mode = "fields-form" | "review";

export const CreatePromptButton: FC<Props> = ({ descriptor, className }) => {
   const [isPending, startTransition] = useTransition();
   const [mode, setMode] = useState<Mode | null>(null);
   const [promptTemplate, setPromptTemplate] = useState<DPromptTemplate | null>(
      null
   );
   const [generatedPrompt, setGeneratedPrompt] = useState<DPromptUpdate | null>(
      null
   );

   const handleCreate = async () => {
      startTransition(async () => {
         const promptTemplate = await getPromptTemplate(
            descriptor.promptTemplateId
         );

         const hasFields = promptTemplate && promptTemplate.fields.length > 0;
         if (hasFields) {
            setPromptTemplate(promptTemplate);
            setMode("fields-form");
         } else {
            await composePrompt({});
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
               onSubmit={composePrompt}
               onCancel={handleCancel}
               mode="review"
               promptUpdate={generatedPrompt}
            />
         );
      }
      if (mode === "fields-form" && descriptor) {
         const tempalte = promptTemplate as DPromptTemplate;
         const desc: DPromptTemplateDescriptorWithTemplate = {
            ...descriptor,
            promptTemplate: tempalte,
         };
         return (
            <CreatePromptDialog
               onSubmit={composePrompt}
               onCancel={handleCancel}
               mode="fields-form"
               descriptor={desc}
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
            <span>Prompt erstellen</span>
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
            data-testid="create-prompt-btn"
         >
            {label()}
         </Button>
         {dialog()}
      </>
   );
};
