"use client";

import { FC, useState } from "react";
import { map } from "es-toolkit/compat";
import { Plus } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DGlobalTemplateField } from "@/data/types/domain/settings";

import { GlobalTemplateFieldEditDialog } from "./dialogs";
import { GlobalTemplateFieldItem } from "./template-field-item";

type Props = {
   fields: DGlobalTemplateField[];
};

export const GlobalFieldList: FC<Props> = ({ fields }) => {
   const [dialogOpen, setDialogOpen] = useState(false);
   const [editingField, setEditingField] = useState<
      DGlobalTemplateField | undefined
   >();

   const handleAdd = () => {
      setEditingField(undefined);
      setDialogOpen(true);
   };

   const renderField_ = (field: DGlobalTemplateField) => {
      return <GlobalTemplateFieldItem field={field} key={field.id} />;
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
      </div>
   );
};
