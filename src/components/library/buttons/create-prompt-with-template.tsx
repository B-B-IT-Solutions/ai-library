"use client";

import { FC, useState, useTransition } from "react";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";

import { PromptEdit } from "@/components/prompts";
import { Button } from "@/components/shadcn/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { TemplateFieldForm } from "@/components/templates/template-field-form";
import {
   composePromptFromTemplate,
   createPromptFromTemplate,
} from "@/data/actions/library";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";
import { cn } from "@/lib/utils";

type CreatePromptWithTemplateProps = {
   descriptor: DPromptTemplateDescriptorWithTemplate;
   className?: string;
};

type Mode = "form" | "preview" | "closed";

export const CreatePromptWithTemplate: FC<CreatePromptWithTemplateProps> = ({
   descriptor,
   className,
}) => {
   const [isPending, startTransition] = useTransition();
   const [mode, setMode] = useState<Mode>("closed");
   const [generatedPrompt, setGeneratedPrompt] = useState<DPromptUpdate | null>(
      null
   );

   const hasFields = descriptor.promptTemplate.fields.length > 0;

   const handleClick = () => {
      if (!hasFields) {
         // No fields, directly create prompt
         startTransition(async () => {
            const result = await createPromptFromTemplate(descriptor.id);
            if (result.success) {
               toast.success(result.message);
            } else {
               toast.error(result.message);
            }
         });
      } else {
         // Has fields, show form
         setMode("form");
      }
   };

   const handleFieldsSubmit = async (values: DPromptTemplateFieldValues) => {
      startTransition(async () => {
         const result = await composePromptFromTemplate(descriptor.id, values);
         if (result.success && result.data) {
            setGeneratedPrompt(result.data);
            setMode("preview");
         } else {
            toast.error(result.message || "Fehler beim Generieren");
         }
      });
   };

   const handleCancel = () => {
      setMode("closed");
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

         <Dialog open={mode !== "closed"} onOpenChange={() => handleCancel()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
               <DialogHeader>
                  <DialogTitle>
                     {mode === "form"
                        ? "Prompt-Vorlage ausfüllen"
                        : "Prompt-Vorschau"}
                  </DialogTitle>
               </DialogHeader>
               {mode === "form" && (
                  <div className="space-y-4">
                     <div className="text-sm text-muted-foreground">
                        <p className="font-semibold">{descriptor.title}</p>
                        <p>{descriptor.description}</p>
                     </div>
                     <TemplateFieldForm
                        fields={descriptor.promptTemplate.fields}
                        onSubmit={handleFieldsSubmit}
                        onCancel={handleCancel}
                     />
                  </div>
               )}
               {mode === "preview" && generatedPrompt && (
                  <PromptEdit prompt={generatedPrompt} mode="review-template" />
               )}
            </DialogContent>
         </Dialog>
      </>
   );
};
