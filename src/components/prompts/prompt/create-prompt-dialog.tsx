"use client";

import { FC } from "react";
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
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateField,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";
import { DGlobalTemplateField } from "@/data/types/domain/settings";

import { PromptEdit } from "./prompt-edit";

type Props = {
   onSubmit: (values: DPromptTemplateFieldValues) => void;
   onCancel: CallbackFn;
} & (
   | {
        mode: "fields-form";
        descriptor: DPromptTemplateDescriptorWithTemplate;
        globalFields: DGlobalTemplateField[];
        promptUpdate?: undefined;
     }
   | {
        mode: "review";
        descriptor?: undefined;
        globalFields?: undefined;
        promptUpdate: DPromptUpdate;
     }
);

export const CreatePromptDialog: FC<Props> = ({
   onSubmit,
   onCancel,
   mode,
   descriptor,
   globalFields,
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
         const mappedGlobalFields: DPromptTemplateField[] = globalFields.map(
            (f) => ({
               id: f.id,
               promptTemplateId: "",
               name: f.name,
               label: f.label,
               description: f.description,
               type: f.type,
               required: f.required,
               order: f.order,
               defaultValue: f.defaultValue,
               options: f.options ?? undefined,
            })
         );
         const allFields = [
            ...descriptor.promptTemplate.fields,
            ...mappedGlobalFields,
         ];
         return (
            <div className="space-y-4">
               <div className="text-sm text-muted-foreground">
                  <p className="font-semibold">{descriptor.title}</p>
                  <p>{descriptor.description}</p>
               </div>
               <TemplateFieldForm
                  fields={allFields}
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
               <DialogTitle>{title()}</DialogTitle>
            </DialogHeader>
            {content()}
         </DialogContent>
      </Dialog>
   );
};
