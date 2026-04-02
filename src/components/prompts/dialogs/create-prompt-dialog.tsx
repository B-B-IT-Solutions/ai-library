"use client";

import { useState } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";
import { useRouter } from "next/navigation";

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

export const CreatePromptDialog = ({ onCancel, promptUpdate }: Props) => {
   const router = useRouter();
   const [isExpanded, setIsExpanded] = useState(false);

   const handleSuccess = () => {
      router.push("/prompts");
   };

   const expandBtn = () => {
      return (
         <button
            onClick={() => setIsExpanded((v) => !v)}
            className="absolute top-4 right-12 cursor-pointer rounded-sm bg-background px-2 py-2 hover:bg-accent"
            data-testid="expand-btn"
         >
            {isExpanded ? (
               <Minimize2 className="h-4 w-4" />
            ) : (
               <Maximize2 className="h-4 w-4" />
            )}
         </button>
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
            className={`flex flex-col gap-0 overflow-hidden p-0 transition-all duration-200 ${
               isExpanded
                  ? "h-screen max-h-screen w-screen sm:max-w-none"
                  : "max-h-[90vh] sm:max-w-5xl"
            }`}
         >
            {expandBtn()}
            <DialogClose asChild={true}>
               <button
                  className="absolute top-4 right-4 cursor-pointer rounded-sm bg-background px-2 py-2 hover:bg-accent"
                  data-testid="close-btn"
               >
                  <X className="h-4 w-4" />
               </button>
            </DialogClose>
            <DialogHeader className="shrink-0 px-6 pt-6 pb-2">
               <DialogTitle>Prompt-Vorschau</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 pb-6">
               <PromptEditForm
                  prompt={promptUpdate}
                  mode="review-template"
                  onCancel={onCancel}
                  onSuccess={handleSuccess}
               />
            </div>
         </DialogContent>
      </Dialog>
   );
};
