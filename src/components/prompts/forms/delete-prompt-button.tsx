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
   AlertDialogTrigger,
} from "@/components/shadcn/alert-dialog";
import { Button } from "@/components/shadcn/button";
import { deletePrompt } from "@/data/actions/prompt";

type DeletePromptButtonProps = {
   promptId: string;
};

export const DeletePromptButton: FC<DeletePromptButtonProps> = ({
   promptId,
}) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();
   const [isOpen, setIsOpen] = useState(false);

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
         <AlertDialogTrigger asChild>
            <Button
               variant="outline"
               className="flex items-center gap-2 px-4 py-2 border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
               data-testid="delete-prompt-btn"
            >
               <Trash2 className="w-4 h-4" />
               Delete
            </Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
               <AlertDialogDescription>
                  Are you sure you want to delete this prompt? This action
                  cannot be undone. All versions and follow-up prompts will be
                  deleted.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel disabled={isPending}>
                  Cancel
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isPending}
                  className="bg-red-600 hover:bg-red-700"
               >
                  {isPending ? (
                     <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                     </>
                  ) : (
                     "Delete"
                  )}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};
