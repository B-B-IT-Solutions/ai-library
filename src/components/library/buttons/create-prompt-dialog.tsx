"use client";

import { FC, useState, useTransition } from "react";
import { toast } from "sonner";

import { PromptEdit } from "@/components/prompts";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { TemplateFieldForm } from "@/components/templates/template-field-form";
import { composePromptFromTemplate } from "@/data/actions/library";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";

type Mode = "form" | "preview" | "closed";

type Props = {
   open: boolean;
   descriptor: DPromptTemplateDescriptorWithTemplate;
   mode: Mode;
};

export const CreatePromptDialog: FC<Props> = ({ open, descriptor }) => {
   const [isPending, startTransition] = useTransition();
   const [mode, setMode] = useState<Mode>("closed");
   const [generatedPrompt, setGeneratedPrompt] = useState<DPromptUpdate | null>(
      null
   );

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

   return (
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
   );
};
