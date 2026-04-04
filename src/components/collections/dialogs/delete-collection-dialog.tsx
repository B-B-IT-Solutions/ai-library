"use client";

import { FC } from "react";
import { Loader, Trash2 } from "lucide-react";
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
import { useDeleteCollection } from "@/data/ts-queries/library";
import { DCollection } from "@/data/types/domain/collection";

type Props = {
   collection: DCollection;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onDeleted?: () => void;
};

export const DeleteCollectionDialog: FC<Props> = ({
   collection,
   open,
   onOpenChange,
   onDeleted,
}) => {
   const { mutate: deleteCollection, isPending } = useDeleteCollection();

   const handleDelete = () => {
      deleteCollection(collection.id, {
         onSuccess: (result) => {
            if (result.success) {
               toast.success(result.message);
               onOpenChange(false);
               onDeleted?.();
            } else {
               toast.error(result.message);
            }
         },
         onError: () => {
            toast.error("Fehler beim Löschen der Sammlung");
         },
      });
   };

   return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
         <AlertDialogContent data-testid="delete-collection-dialog">
            <AlertDialogHeader>
               <AlertDialogTitle>Sammlung löschen?</AlertDialogTitle>
               <AlertDialogDescription>
                  Die Sammlung <strong>&ldquo;{collection.name}&rdquo;</strong>{" "}
                  wird unwiderruflich gelöscht. Die enthaltenen Vorlagen bleiben
                  erhalten.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel>Abbrechen</AlertDialogCancel>
               <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isPending}
                  className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                  data-testid="confirm-delete-btn"
               >
                  {isPending ? (
                     <Loader className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                     <Trash2 className="mr-1.5 h-4 w-4" />
                  )}
                  Löschen
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};
