"use client";

import { FC } from "react";

import { PromptEdit } from "@/components/prompts";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { TemplateFieldForm } from "@/components/templates/template-field-form";
import { CallbackFn } from "@/data/types/common";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";

type Props = {
   onSubmit: (values: DPromptTemplateFieldValues) => void;
   onCancel: CallbackFn;
} & (
   | {
        mode: "fields-form";
        descriptor: DPromptTemplateDescriptorWithTemplate;
        promptUpdate?: undefined;
     }
   | {
        mode: "review";
        descriptor?: undefined;
        promptUpdate: DPromptUpdate;
     }
);

export const CreatePromptDialog: FC<Props> = ({
   onSubmit,
   onCancel,
   mode,
   descriptor,
   promptUpdate,
}) => {
   const title = () => {
      if (mode === "fields-form") {
         return "Prompt-Vorlage ausfüllen";
      }
      return "Prompt-Vorschau";
   };

   const content = () => {
      if (mode === "fields-form") {
         return (
            <div className="space-y-4">
               <div className="text-sm text-muted-foreground">
                  <p className="font-semibold">{descriptor.title}</p>
                  <p>{descriptor.description}</p>
               </div>
               <TemplateFieldForm
                  fields={descriptor.promptTemplate.fields}
                  onSubmit={onSubmit}
                  onCancel={onCancel}
               />
            </div>
         );
      }
      return <PromptEdit prompt={promptUpdate} mode="review-template" />;
   };

   return (
      <Dialog
         open={true}
         onOpenChange={() => onCancel()}
         data-testid="create-prompt-dialog"
      >
         <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
            <DialogHeader>
               <DialogTitle>{title()}</DialogTitle>
            </DialogHeader>
            {content()}
         </DialogContent>
      </Dialog>
   );
};
