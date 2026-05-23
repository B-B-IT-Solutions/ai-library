"use client";

import { useState, useTransition } from "react";
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
import { Button } from "@/components/shadcn/button";
import { DeleteDropdownMenuItem } from "@/components/shared/dropdowns";
import { deletePrompt } from "@/data/actions/prompt";
import { DPrompt } from "@/data/types/domain/prompt";

type Props = {
   prompt: DPrompt;
   asMenuItem?: boolean;
};

export const DeletePromptButton = ({ prompt, asMenuItem }: Props) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();
   const [isOpen, setIsOpen] = useState(false);

   const handleDelete = async () => {
      const result = await deletePrompt(prompt.id);
      if (result.success) {
         toast.success(result.message);
         router.push("/templates");
      } else {
         toast.error(result.message);
      }
   };

   const handleConfirm = () => {
      startTransition(async () => {
         await handleDelete();
         setIsOpen(false);
      });
   };

   if (asMenuItem) {
      return (
         <DeleteDropdownMenuItem
            label="Löschen"
            onDelete={handleDelete}
            dialog={{
               title: "Vorlage löschen?",
               description:
                  "Diese Aktion kann nicht rückgängig gemacht werden. Die Vorlage wird dauerhaft gelöscht.",
            }}
            data-testid="delete-prompt-menu-item"
         />
      );
   }

   return (
      <>
         <Button
            variant="ghost"
            onClick={() => setIsOpen(true)}
            className="w-full cursor-pointer justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            data-testid="delete-prompt-btn"
         >
            <Trash2 className="mr-2 h-4 w-4" />
            Löschen
         </Button>
         <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Vorlage löschen?</AlertDialogTitle>
                  <AlertDialogDescription>
                     Diese Aktion kann nicht rückgängig gemacht werden. Die
                     Vorlage „{prompt.title}" wird dauerhaft gelöscht.
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
                     onClick={handleConfirm}
                     disabled={isPending}
                     className="cursor-pointer bg-red-600 hover:bg-red-700"
                  >
                     {isPending && (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                     )}
                     <span>Löschen</span>
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
};
