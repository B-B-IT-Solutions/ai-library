"use client";

import { useEffect, useMemo, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/shadcn/dialog";
import { Form } from "@/components/shadcn/form";
import { FormInput } from "@/components/shared/widgets";
import { updatePromptCategory } from "@/data/actions/prompt";
import {
   DPromptCategoryUpdate,
   DPromptCategoryWithUsage,
} from "@/data/types/domain/prompt";
import { initPromptCategory } from "../utils";

import { updateCategorySchemaBackendValidation } from "./update-category.schema";

type Props = {
   open: boolean;
   onClose: () => void;
   category: DPromptCategoryWithUsage;
};

export const UpdateCategoryDialog = ({ open, onClose, category }: Props) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const updateSchema = useMemo(
      () => updateCategorySchemaBackendValidation(category.id),
      [category.id]
   );

   const form = useForm<DPromptCategoryUpdate>({
      resolver: zodResolver(updateSchema),
      defaultValues: initPromptCategory(category),
   });

   useEffect(() => {
      if (open) {
         form.reset(initPromptCategory(category));
      }
   }, [open, category, form]);

   const onSubmit: SubmitHandler<DPromptCategoryUpdate> = async (data) => {
      startTransition(async () => {
         const result = await updatePromptCategory(category.id, data);
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
               Wird gespeichert
            </>
         );
      }
      return "Speichern";
   };

   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent data-testid="update-category-dialog">
            <DialogHeader>
               <DialogTitle>Kategorie umbenennen</DialogTitle>
               <DialogDescription>
                  Benenne die Kategorie <strong>{category.name}</strong> um.
                  Die Änderung wirkt sich auf alle Prompts aus, die dieser
                  Kategorie zugeordnet sind.
               </DialogDescription>
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
