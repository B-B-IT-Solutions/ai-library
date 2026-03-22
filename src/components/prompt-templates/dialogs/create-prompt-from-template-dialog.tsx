"use client";

import { X } from "lucide-react";

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
import { PromptFromTemplate } from "../use-template/prompt-from-template";

type Props = {
   onSubmit: (values: DPromptTemplateFieldValues) => void;
   onCancel: CallbackFn;
   descriptor: DPromptTemplateDescriptor;
   templateData: DPromptTemplateDataPromptGeneration;
};

export const CreatePromptFromTemplateDialog = ({
   onSubmit,
   onCancel,
   descriptor,
   templateData,
}: Props) => {
   return (
      <Dialog
         open={true}
         onOpenChange={() => onCancel()}
         data-testid="create-prompt-from-template-dialog"
      >
         <DialogContent
            showCloseButton={false}
            className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl"
         >
            <DialogClose asChild={true}>
               <button
                  data-testid="close-btn"
                  className="absolute top-4 right-4 cursor-pointer rounded-sm bg-background px-2 py-2 hover:bg-accent"
               >
                  <X className="h-4 w-4" />
               </button>
            </DialogClose>
            <DialogHeader className="shrink-0 px-6 pt-6 pb-2">
               <DialogTitle>Vorlage Felder Ausfüllen</DialogTitle>
               <p className="text-sm font-semibold text-muted-foreground">
                  {descriptor.title}
               </p>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">
               <PromptFromTemplate
                  templateData={templateData}
                  onSubmit={onSubmit}
                  recommendedModel={descriptor.recommendedModel}
               />
            </div>
         </DialogContent>
      </Dialog>
   );
};
