"use client";

import { FC, useState, useTransition } from "react";
import { Loader, Trash2 } from "lucide-react";
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
import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { deletePrompt } from "@/data/actions/prompt";

type DeletePromptButtonProps = {
   promptId: string;
};

export const DeletePromptButton: FC<DeletePromptButtonProps> = ({
   promptId,
}) => {
   const [isPending, startTransition] = useTransition();
   const [isOpen, setIsOpen] = useState(false);
   const router = useRouter();

   const handleDelete = () => {
      startTransition(async () => {
         const result = await deletePrompt(promptId);
         if (result.success) {
            toast.success(result.message);
            router.push("/prompts");
         } else {
            toast.error(result.message);
         }
         setIsOpen(false);
      });
   };

   return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
         <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
               e.preventDefault();
               setIsOpen(true);
            }}
            className="cursor-pointer"
            data-testid="delete-prompt-btn"
         >
            <Trash2 className="size-4" />
            Löschen
         </DropdownMenuItem>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Prompt löschen</AlertDialogTitle>
               <AlertDialogDescription>
                  Sind Sie sicher, dass Sie diesen Prompt löschen möchten? Diese
                  Aktion kann nicht rückgängig gemacht werden. Alle Versionen
                  und Folge-Prompts werden ebenfalls gelöscht.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel
                  disabled={isPending}
                  className="cursor-pointer"
               >
                  Abbrechen
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isPending}
                  className="bg-red-600 hover:bg-red-700 cursor-pointer"
               >
                  {isPending ? (
                     <>
                        <Loader className="size-4 mr-2 animate-spin" />
                        Wird gelöscht...
                     </>
                  ) : (
                     "Löschen"
                  )}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};
