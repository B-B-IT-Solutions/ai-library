"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { Form } from "@/components/shadcn/form";
import { FormInput } from "@/components/shared/widgets";
import { createPromptCategory } from "@/data/actions/prompt";
import { DPromptCategoryUpdate } from "@/data/types/domain/prompt";
import { updatePromptCategorySchema } from "@/data/types/validators/template";
import { initPromptCategory } from "../utils";

type Props = {
   open: boolean;
   onClose: () => void;
};

export const CreateCategoryDialog = ({ open, onClose }: Props) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const form = useForm<DPromptCategoryUpdate>({
      resolver: zodResolver(updatePromptCategorySchema),
      defaultValues: initPromptCategory(),
   });

   useEffect(() => {
      if (open) {
         form.reset(initPromptCategory());
      }
   }, [open, form]);

   const onSubmit: SubmitHandler<DPromptCategoryUpdate> = async (data) => {
      startTransition(async () => {
         const result = await createPromptCategory(data);
         if (result.success) {
            toast.success(result.message);
            router.refresh();
            onClose();
         } else {
            toast.error(result.message);
         }
      });
   };

   const confirmBtnLabel = () => {
      if (isPending) {
         return (
            <>
               <Loader className="h-4 w-4" />
               Wird erstellt
            </>
         );
      }
      return "Erstellen";
   };

   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent data-testid="create-category-dialog">
            <DialogHeader>
               <DialogTitle>Neue Kategorie erstellen</DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
               >
                  <FormInput<DPromptCategoryUpdate>
                     name="name"
                     label="Name"
                     placeholder="Kategorie-Name"
                     control={form.control}
                  />
                  <DialogFooter>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                        className="cursor-pointer"
                        data-testid="cancel-btn"
                     >
                        Abbrechen
                     </Button>
                     <Button
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer"
                        data-testid="submit-btn"
                     >
                        {confirmBtnLabel()}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};
