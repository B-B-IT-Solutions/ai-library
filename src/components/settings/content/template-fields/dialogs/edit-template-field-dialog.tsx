"use client";

import { useEffect } from "react";
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
import { globalTemplateFieldInitValues } from "@/components/shared/template-fields";
import { updateGlobalTemplateField } from "@/data/actions/settings";
import {
   DGlobalTemplateField,
   DGlobalTemplateFieldUpdate,
} from "@/data/types/domain/settings";
import { globalTemplateFieldSchema } from "@/data/types/validators/settings";

import { GlobalTemplateFieldForm } from "./template-field-form";

type Props = {
   open: boolean;
   onClose: () => void;
   field: DGlobalTemplateField;
};

export const GlobalTemplateFieldEditDialog = ({
   open,
   onClose,
   field,
}: Props) => {
   const router = useRouter();

   const form = useForm<DGlobalTemplateFieldUpdate>({
      resolver: zodResolver(globalTemplateFieldSchema),
      defaultValues: globalTemplateFieldInitValues(field),
   });

   useEffect(() => {
      if (open) {
         form.reset(globalTemplateFieldInitValues(field));
      }
   }, [open, field, form]);

   const { isSubmitting } = form.formState;

   const onSubmit: SubmitHandler<DGlobalTemplateFieldUpdate> = async (data) => {
      const result = await updateGlobalTemplateField(field.id, data);
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
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
         <DialogContent
            className="sm:max-w-3xl"
            data-testid="template-field-edit-dialog"
         >
            <DialogHeader>
               <DialogTitle>Feld Bearbeiten</DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
               >
                  <GlobalTemplateFieldForm
                     watch={form.watch}
                     control={form.control}
                  />
                  <DialogFooter>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        data-testid="cancel-btn"
                     >
                        Abbrechen
                     </Button>
                     <Button type="submit" disabled={isSubmitting}>
                        {confirmBtnLabel()}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};
