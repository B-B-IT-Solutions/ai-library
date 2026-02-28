"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { GlobalTemplateFieldEditDialog } from "../dialogs";

type Props = {
   field: DGlobalTemplateField;
};

export const EditGlobalTemplateFieldButton = ({ field }: Props) => {
   const [dialogOpen, setDialogOpen] = useState(false);

   const handleEdit = () => {
      setDialogOpen(true);
   };

   return (
      <>
         <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            data-testid="edit-tempplate-field-btn"
         >
            <Pencil className="h-4 w-4" />
         </Button>
         <GlobalTemplateFieldEditDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            field={field}
         />
      </>
   );
};
