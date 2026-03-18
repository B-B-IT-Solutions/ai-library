"use client";

import { X } from "lucide-react";

import { TemplateFieldForm } from "@/components/prompt-templates";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { CallbackFn } from "@/data/types/common";
import {
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateDescriptor,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";

type Props = {
   onSubmit: (values: DPromptTemplateFieldValues) => void;
   onCancel: CallbackFn;
   descriptor: DPromptTemplateDescriptor;
   templateData: DPromptTemplateDataPromptGeneration;
};

export const CreateTemplateFieldsFormDialog = ({
   onSubmit,
   onCancel,
   descriptor,
   templateData,
}: Props) => {
   const content = () => {
      return (
         <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
               <p className="font-semibold">{descriptor.title}</p>
            </div>
            <TemplateFieldForm
               templateData={templateData}
               onSubmit={onSubmit}
               onCancel={onCancel}
               recommendedModel={descriptor.recommendedModel}
            />
         </div>
      );
   };

   return (
      <Dialog
         open={true}
         onOpenChange={() => onCancel()}
         data-testid="create-prompt-dialog"
      >
         <DialogContent
            showCloseButton={false}
            className="max-h-[90vh] overflow-y-auto sm:max-w-5xl"
         >
            <DialogClose asChild={true}>
               <button
                  data-testid="close-btn"
                  className="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100"
               >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
               </button>
            </DialogClose>
            <DialogHeader>
               <DialogTitle>Vorlage Felder Ausfüllen</DialogTitle>
            </DialogHeader>
            {content()}
         </DialogContent>
      </Dialog>
   );
};
