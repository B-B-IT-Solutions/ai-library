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
import { DPromptUpdate } from "@/data/types/domain/prompt";
import { PromptEditForm } from "../prompt";

type Props = {
   onCancel: CallbackFn;
   promptUpdate: DPromptUpdate;
};

export const CreatePromptPreviewDialog = ({
   onCancel,
   promptUpdate,
}: Props) => {
   const content = () => {
      return <PromptEditForm prompt={promptUpdate} mode="review-template" />;
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
               <DialogTitle>Prompt-Vorschau</DialogTitle>
            </DialogHeader>
            {content()}
         </DialogContent>
      </Dialog>
   );
};
