"use client";

import { useTransition } from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/shadcn/alert-dialog";
import { deletePromptModel } from "@/data/actions/prompt";
import { DPromptModelWithUsage } from "@/data/types/domain/prompt";

type Props = {
   open: boolean;
   onClose: () => void;
   model: DPromptModelWithUsage;
};

const affectedPromptsLabel = (count: number) => {
   if (count === 0) {
      return "Es ist aktuell keinem Prompt zugewiesen.";
   }
   if (count === 1) {
      return "Es ist aktuell 1 Prompt zugewiesen. Dieser Prompt hat danach kein Modell mehr.";
   }
   return `Es ist aktuell ${count} Prompts zugewiesen. Diese Prompts haben danach kein Modell mehr.`;
};

export const DeleteModelDialog = ({ open, onClose, model }: Props) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const handleDeleteConfirm = async () => {
      startTransition(async () => {
         const result = await deletePromptModel(model.id);
         if (result.success) {
            toast.success(result.message);
            router.refresh();
         } else {
            toast.error(result.message);
         }
         onClose();
      });
   };

   const confirmBtnLabel = () => {
      if (isPending) {
         return (
            <>
               <Loader className="h-4 w-4" />
               Wird gelöscht
            </>
         );
      }
      return "Löschen";
   };

   return (
      <AlertDialog open={open} onOpenChange={onClose}>
         <AlertDialogContent data-testid="model-delete-dialog">
            <AlertDialogHeader>
               <AlertDialogTitle>Modell löschen?</AlertDialogTitle>
               <AlertDialogDescription>
                  Möchtest du das Modell <strong>{model.name}</strong>{" "}
                  wirklich löschen? {affectedPromptsLabel(model.count)} Diese
                  Aktion kann nicht rückgängig gemacht werden.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel
                  className="cursor-pointer"
                  data-testid="cancel-btn"
               >
                  Abbrechen
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={isPending}
                  className="cursor-pointer bg-destructive hover:bg-destructive/90"
                  data-testid="confirm-btn"
               >
                  {confirmBtnLabel()}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};
