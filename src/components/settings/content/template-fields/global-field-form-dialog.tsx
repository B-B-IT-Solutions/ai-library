"use client";

import { FC, useEffect } from "react";
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
   FormCheckBox,
   FormInput,
   FormSelect,
   FormTextArea,
} from "@/components/shared/widgets";
import {
   createGlobalTemplateField,
   updateGlobalTemplateField,
} from "@/data/actions/settings";
import {
   DGlobalTemplateField,
   DGlobalTemplateFieldUpdate,
} from "@/data/types/domain/settings";
import { globalTemplateFieldSchema } from "@/data/types/validators/settings";

const FIELD_TYPES = [
   { value: "TEXT", label: "Text" },
   { value: "TEXTAREA", label: "Textarea" },
   { value: "EMAIL", label: "E-Mail" },
   { value: "NUMBER", label: "Nummer" },
   { value: "DATE", label: "Datum" },
   { value: "SELECT", label: "Auswahl" },
   { value: "CHECKBOX", label: "Checkbox" },
   { value: "RADIO", label: "Radio" },
];

type Props = {
   open: boolean;
   onClose: () => void;
   field?: DGlobalTemplateField;
};

export const GlobalFieldFormDialog: FC<Props> = ({ open, onClose, field }) => {
   const router = useRouter();
   const isEdit = !!field;

   const form = useForm<DGlobalTemplateFieldUpdate>({
      resolver: zodResolver(globalTemplateFieldSchema),
      defaultValues: getDefaultValues(field),
   });

   useEffect(() => {
      if (open) {
         form.reset(getDefaultValues(field));
      }
   }, [open, field]);

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

   const nameValue = form.watch("name") || "name";

   return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
         <DialogContent className="sm:max-w-3xl">
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
                  <div className="grid grid-cols-2 gap-4">
                     <FormInput<DGlobalTemplateFieldUpdate>
                        name="name"
                        label="Name"
                        placeholder="Name des Feldes"
                        message={`Verwenden Sie diesen Namen als {{${nameValue}}}`}
                        control={form.control}
                     />
                     <FormInput<DGlobalTemplateFieldUpdate>
                        name="label"
                        label="Label"
                        placeholder="Label des Feldes"
                        fixStyling={true}
                        control={form.control}
                     />
                     <FormSelect<DGlobalTemplateFieldUpdate>
                        name="type"
                        label="Typ"
                        options={FIELD_TYPES}
                        control={form.control}
                     />
                     <FormInput<DGlobalTemplateFieldUpdate>
                        name="defaultValue"
                        label="Standardwert"
                        placeholder="Standardwert des Feldes"
                        control={form.control}
                     />
                     <FormTextArea<DGlobalTemplateFieldUpdate>
                        name="description"
                        label="Beschreibung"
                        placeholder="Beschreibung des Feldes"
                        rows={2}
                        className="col-span-2"
                        control={form.control}
                     />
                     <FormCheckBox<DGlobalTemplateFieldUpdate>
                        name="required"
                        label="Dieses Feld ist erforderlich"
                        className="col-span-2"
                        control={form.control}
                     />
                  </div>
                  <DialogFooter>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
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

function getDefaultValues(
   field?: DGlobalTemplateField
): DGlobalTemplateFieldUpdate {
   return {
      name: field?.name ?? "",
      label: field?.label ?? "",
      description: field?.description ?? "",
      type: field?.type ?? "TEXT",
      required: field?.required ?? true,
      defaultValue: field?.defaultValue ?? "",
      options: field?.options ?? [],
      order: field?.order ?? 0,
   };
}
