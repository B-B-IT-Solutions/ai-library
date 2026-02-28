"use client";

import { FC, useState } from "react";
import { map } from "es-toolkit/compat";
import { Pencil, Plus, Trash2 } from "lucide-react";
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

import { GlobalTemplateFieldEditDialog } from "./dialogs";
import { GlobalFieldListItem } from "./global-field-list-item";

type Props = {
   fields: DGlobalTemplateField[];
};

export const GlobalFieldList: FC<Props> = ({ fields }) => {
   const router = useRouter();
   const [dialogOpen, setDialogOpen] = useState(false);
   const [editingField, setEditingField] = useState<
      DGlobalTemplateField | undefined
   >();
   const [deleteDialogField, setDeleteDialogField] = useState<
      DGlobalTemplateField | undefined
   >();

   const handleAdd = () => {
      setEditingField(undefined);
      setDialogOpen(true);
   };

   const handleEdit = (field: DGlobalTemplateField) => {
      setEditingField(field);
      setDialogOpen(true);
   };

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

   const renderField_ = (field: DGlobalTemplateField) => {
      return <GlobalFieldListItem field={field} key={field.id} />;
   };

   const renderField = (field: DGlobalTemplateField) => {
      return (
         <div
            key={field.id}
            className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm"
            data-testid="global-field-card"
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
               <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(field)}
                  data-testid="edit-btn"
               >
                  <Pencil className="h-4 w-4" />
               </Button>
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
      <div className="space-y-4" data-testid="global-fields-list">
         <div className="flex justify-end">
            <Button
               type="button"
               variant="outline"
               size="sm"
               onClick={handleAdd}
               className="cursor-pointer"
               data-testid="add-field-btn"
            >
               <Plus className="mr-1 h-4 w-4" />
               Feld hinzufügen
            </Button>
         </div>

         <div className="space-y-2">{map(fields, renderField_)}</div>

         <GlobalTemplateFieldEditDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            field={editingField}
         />

         {comfirmDeleteDialog()}
      </div>
   );
};
