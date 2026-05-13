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
import { deleteGlobalPromptField } from "@/data/actions/settings";
import { DGlobalPromptField } from "@/data/types/domain/settings";

type Props = {
   open: boolean;
   onClose: () => void;
   field: DGlobalPromptField;
};

export const GlobalPromptFieldDeleteConfirmDialog = ({
   open,
   onClose,
   field,
}: Props) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const handleDeleteConfirm = async () => {
      startTransition(async () => {
         const result = await deleteGlobalPromptField(field.id);
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
         <AlertDialogContent data-testid="template-field-delete-dialog">
            <AlertDialogHeader>
               <AlertDialogTitle>Feld löschen?</AlertDialogTitle>
               <AlertDialogDescription>
                  Möchten Sie das Feld <strong>{`{{${field.name}}}`}</strong>{" "}
                  wirklich löschen? Diese Aktion kann nicht rückgängig gemacht
                  werden.
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
