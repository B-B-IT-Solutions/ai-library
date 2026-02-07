"use client";

import { FC, useState, useTransition } from "react";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { composePromptFromTemplate } from "@/data/actions/library";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";
import { cn } from "@/lib/utils";

import { CreatePromptDialog } from "./create-prompt-dialog";

type CreatePromptWithTemplateProps = {
   descriptor: DPromptTemplateDescriptorWithTemplate;
   className?: string;
};

type Mode = "fields-form" | "review";

export const CreatePromptWithTemplate: FC<CreatePromptWithTemplateProps> = ({
   descriptor,
   className,
}) => {
   const [isPending, startTransition] = useTransition();
   const [mode, setMode] = useState<Mode | null>(null);
   const [generatedPrompt, setGeneratedPrompt] = useState<DPromptUpdate | null>(
      null
   );

   const hasFields = descriptor.promptTemplate.fields.length > 0;

   const handleClick = async () => {
      if (!hasFields) {
         await handleComposePrompt({});
      } else {
         setMode("fields-form");
      }
   };

   const handleComposePrompt = async (values: DPromptTemplateFieldValues) => {
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

   const handleCancel = () => {
      setMode(null);
      setGeneratedPrompt(null);
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

   const dialog = () => {
      if (mode === "review" && generatedPrompt) {
         return (
            <CreatePromptDialog
               onSubmit={handleComposePrompt}
               onCancel={handleCancel}
               mode="review"
               promptUpdate={generatedPrompt}
            />
         );
      }
      if (mode === "fields-form" && descriptor) {
         return (
            <CreatePromptDialog
               onSubmit={handleComposePrompt}
               onCancel={handleCancel}
               mode="fields-form"
               descriptor={descriptor}
            />
         );
      }
   };

   return (
      <>
         <Button
            variant="default"
            size="sm"
            onClick={handleClick}
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
