"use client";

import { useEffect, useMemo } from "react";
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
import { renamePromptCategory } from "@/data/actions/prompt";
import {
   DPromptCategoryUsage,
   DRenameCategory,
} from "@/data/types/domain/prompt";
import { buildRenameCategorySchema } from "@/data/types/validators/template";

type Props = {
   open: boolean;
   onClose: () => void;
   category: DPromptCategoryUsage;
};

export const RenameCategoryDialog = ({ open, onClose, category }: Props) => {
   const router = useRouter();

   const renameSchema = useMemo(
      () => buildRenameCategorySchema(category.id),
      [category.id]
   );

   const form = useForm<DRenameCategory>({
      resolver: zodResolver(renameSchema),
      defaultValues: { name: category.name },
   });

   useEffect(() => {
      if (open) {
         form.reset({ name: category.name });
      }
   }, [open, category, form]);

   const { isSubmitting } = form.formState;

   const onSubmit: SubmitHandler<DRenameCategory> = async (data) => {
      const result = await renamePromptCategory(category.id, data.name);
      if (result.success) {
         toast.success(result.message);
         router.refresh();
         onClose();
      } else {
         toast.error(result.message);
      }
   };

   const confirmBtnLabel = () => {
      if (isSubmitting) {
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
         <DialogContent data-testid="category-rename-dialog">
            <DialogHeader>
               <DialogTitle>Kategorie umbenennen</DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
               >
                  <FormInput<DRenameCategory>
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
                        disabled={isSubmitting}
                        className="cursor-pointer"
                        data-testid="cancel-btn"
                     >
                        Abbrechen
                     </Button>
                     <Button
                        type="submit"
                        disabled={isSubmitting}
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
