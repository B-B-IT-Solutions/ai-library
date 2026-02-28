"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
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
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { getFieldTypeLabel } from "@/components/shared/template-fields";
import { deleteGlobalTemplateField } from "@/data/actions/settings";
import { DGlobalTemplateField } from "@/data/types/domain/settings";

import { EditGlobalTemplateFieldButton } from "./buttons";

type Props = {
   field: DGlobalTemplateField;
};

export const GlobalFieldListItem = ({ field }: Props) => {
   const router = useRouter();
   const [deleteDialogField, setDeleteDialogField] = useState<
      DGlobalTemplateField | undefined
   >();

   const handleDeleteConfirm = async () => {
      if (deleteDialogField) {
         const result = await deleteGlobalTemplateField(deleteDialogField.id);
         if (result.success) {
            toast.success(result.message);
            router.refresh();
         } else {
            toast.error(result.message);
         }
         setDeleteDialogField(undefined);
      }
   };

   const comfirmDeleteDialog = () => {
      return (
         <AlertDialog
            open={!!deleteDialogField}
            onOpenChange={(o) => !o && setDeleteDialogField(undefined)}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Feld löschen?</AlertDialogTitle>
                  <AlertDialogDescription>
                     Möchten Sie das Feld{" "}
                     <strong>
                        {deleteDialogField
                           ? `{{${deleteDialogField.name}}}`
                           : ""}
                     </strong>{" "}
                     wirklich löschen? Diese Aktion kann nicht rückgängig
                     gemacht werden.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                     Abbrechen
                  </AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleDeleteConfirm}
                     className="cursor-pointer bg-destructive hover:bg-destructive/90"
                  >
                     Löschen
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      );
   };

   return (
      <div
         key={field.id}
         className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm"
         data-testid="global-template-field"
      >
         <div className="flex items-center gap-3">
            <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-sm text-slate-700">
               {`{{${field.name}}}`}
            </code>
            <span className="text-sm font-medium text-slate-900">
               {field.label}
            </span>
            <Badge variant="secondary" className="text-xs">
               {getFieldTypeLabel(field.type)}
            </Badge>
         </div>
         <div className="flex items-center gap-1">
            <EditGlobalTemplateFieldButton field={field} />
            <Button
               type="button"
               variant="ghost"
               size="sm"
               onClick={() => setDeleteDialogField(field)}
               data-testid="delete-btn"
            >
               <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
         </div>
      </div>
   );
};
