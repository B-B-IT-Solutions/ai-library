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
import { deletePromptCategory } from "@/data/actions/prompt";
import { DPromptCategoryWithUsage } from "@/data/types/domain/prompt";

type Props = {
   open: boolean;
   onClose: () => void;
   category: DPromptCategoryWithUsage;
};

const affectedPromptsLabel = (count: number) => {
   if (count === 0) {
      return "Sie ist aktuell keinem Prompt zugeordnet.";
   }
   if (count === 1) {
      return "Sie ist aktuell 1 Prompt zugeordnet. Dieser Prompt behält alle anderen Kategorien.";
   }
   return `Sie ist aktuell ${count} Prompts zugeordnet. Diese Prompts behalten alle anderen Kategorien.`;
};

export const DeleteCategoryDialog = ({ open, onClose, category }: Props) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const handleDeleteConfirm = async () => {
      startTransition(async () => {
         const result = await deletePromptCategory(category.id);
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
         <AlertDialogContent data-testid="category-delete-dialog">
            <AlertDialogHeader>
               <AlertDialogTitle>Kategorie löschen?</AlertDialogTitle>
               <AlertDialogDescription>
                  Möchtest du die Kategorie <strong>{category.name}</strong>{" "}
                  wirklich löschen? {affectedPromptsLabel(category.count)} Diese
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
