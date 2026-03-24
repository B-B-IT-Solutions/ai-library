"use client";

import { useState, useTransition } from "react";
import { Loader, Trash2 } from "lucide-react";

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
import { AsyncCallbackFn } from "@/data/types/common";

type Props = {
   label: string;
   dialog: {
      title: string;
      description: string;
   };
   onDelete: AsyncCallbackFn;
   "data-testid"?: string;
};

export const DeleteDropdownMenuItem = ({
   label,
   dialog,
   onDelete,
   "data-testid": testId = "delete-dropdown-menu-item",
}: Props) => {
   const [isPending, startTransition] = useTransition();
   const [isOpen, setIsOpen] = useState(false);

   const handleDelete = () => {
      startTransition(async () => {
         await onDelete();
         setIsOpen(false);
      });
   };

   const alertDialog = () => {
      return (
         <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent data-testid="delete-dialog-content">
               <AlertDialogHeader data-testid="delete-dialog-header">
                  <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
                  <AlertDialogDescription>
                     {dialog.description}
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter data-testid="delete-dialog-footer">
                  <AlertDialogCancel
                     disabled={isPending}
                     className="cursor-pointer"
                     data-testid="cancel-btn"
                  >
                     Abbrechen
                  </AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleDelete}
                     disabled={isPending}
                     className="cursor-pointer bg-red-600 hover:bg-red-700"
                     data-testid="confirm-btn"
                  >
                     {isPending && (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                     )}
                     <span>Löschen</span>
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      );
   };

   return (
      <>
         <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
               e.preventDefault();
               setIsOpen(true);
            }}
            className="cursor-pointer hover:bg-accent"
            data-testid={testId}
         >
            <Trash2 className="mr-2 h-4 w-4" />
            {label}
         </DropdownMenuItem>
         {alertDialog()}
      </>
   );
};
