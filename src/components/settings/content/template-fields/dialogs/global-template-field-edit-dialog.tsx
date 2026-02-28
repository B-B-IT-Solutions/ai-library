"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
   TemplateFieldDefaultValue,
   TemplateFieldDescription,
   TemplateFieldLabel,
   TemplateFieldName,
   TemplateFieldRequired,
   TemplateFieldType,
} from "@/components/shared/template-fields";
import { globalTemplateFieldInitValues } from "@/components/shared/template-fields";
import {
   createGlobalTemplateField,
   updateGlobalTemplateField,
} from "@/data/actions/settings";
import {
   DGlobalTemplateField,
   DGlobalTemplateFieldUpdate,
} from "@/data/types/domain/settings";
import { globalTemplateFieldSchema } from "@/data/types/validators/settings";

type Props = {
   open: boolean;
   onClose: () => void;
   field?: DGlobalTemplateField;
};

export const GlobalTemplateFieldEditDialog = ({
   open,
   onClose,
   field,
}: Props) => {
   const router = useRouter();
   const isEdit = !!field;

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
      if (isEdit) {
         const result = await updateGlobalTemplateField(field.id, data);
         if (result.success) {
            toast.success(result.message);
            router.refresh();
            onClose();
         } else {
            toast.error(result.message);
         }
      } else {
         const result = await createGlobalTemplateField(data);
         if (result.success) {
            toast.success(result.message);
            router.refresh();
            onClose();
         } else {
            toast.error(result.message);
         }
      }
   };

   const formInputs = () => {
      return (
         <div className="grid grid-cols-2 gap-4">
            <TemplateFieldName<DGlobalTemplateFieldUpdate>
               name={"name"}
               control={form.control}
               watch={form.watch}
            />
            <TemplateFieldLabel<DGlobalTemplateFieldUpdate>
               name={"label"}
               control={form.control}
            />
            <TemplateFieldType<DGlobalTemplateFieldUpdate>
               name={"type"}
               control={form.control}
            />
            <TemplateFieldDefaultValue<DGlobalTemplateFieldUpdate>
               name="defaultValue"
               control={form.control}
            />
            <TemplateFieldDescription<DGlobalTemplateFieldUpdate>
               name="description"
               control={form.control}
            />
            <TemplateFieldRequired<DGlobalTemplateFieldUpdate>
               name="required"
               control={form.control}
            />
         </div>
      );
   };

   return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
         <DialogContent
            className="sm:max-w-3xl"
            data-testid="template-field-edit-dialog"
         >
            <DialogHeader>
               <DialogTitle>
                  {isEdit ? "Feld Bearbeiten" : "Neues Feld Erstellen"}
               </DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
               >
                  {formInputs()}
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
                        {isSubmitting
                           ? "Wird gespeichert..."
                           : isEdit
                             ? "Speichern"
                             : "Erstellen"}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};
