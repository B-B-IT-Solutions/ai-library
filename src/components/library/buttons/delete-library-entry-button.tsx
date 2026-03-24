"use client";

import { useTransition } from "react";
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
   AlertDialogTrigger,
} from "@/components/shadcn/alert-dialog";
import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { deleteLibraryEntry } from "@/data/actions/library";
import { DLibraryEntry } from "@/data/types/domain/library";

type Props = {
   entry: DLibraryEntry;
};

export const DeleteLibraryEntryButton = ({ entry }: Props) => {
   const [isPending, startTransition] = useTransition();
   const router = useRouter();

   const handleDelete = () => {
      startTransition(async () => {
         const result = await deleteLibraryEntry(entry.id);
         if (result.success) {
            toast.success(result.message);
            router.push("/library");
         } else {
            toast.error(result.message);
         }
      });
   };

   return (
      <AlertDialog>
         <AlertDialogTrigger asChild={true}>
            <DropdownMenuItem
               onSelect={(e) => e.preventDefault()}
               disabled={isPending}
               className="cursor-pointer text-red-600 focus:text-red-600"
               data-testid="delete-entry-menu-item"
            >
               {isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
               ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
               )}
               <span>Löschen</span>
            </DropdownMenuItem>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Vorlage löschen?</AlertDialogTitle>
               <AlertDialogDescription>
                  Diese Aktion kann nicht rückgängig gemacht werden. Die Vorlage
                  wird dauerhaft gelöscht.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel>Abbrechen</AlertDialogCancel>
               <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  data-testid="confirm-delete-btn"
               >
                  Löschen
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};
