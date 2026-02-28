"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { GlobalTemplateFieldDeleteConfirmDialog } from "../dialogs";

type Props = {
   field: DGlobalTemplateField;
};

export const DeleteTemplateFieldButton = ({ field }: Props) => {
   const [open, setOpen] = useState(false);

   const openDialog = () => {
      setOpen(true);
   };

   const closeDialog = () => {
      setOpen(false);
   };

   return (
      <>
         <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={openDialog}
            data-testid="delete-template-field-btn"
         >
            <Trash2 className="h-4 w-4 text-destructive" />
         </Button>
         <GlobalTemplateFieldDeleteConfirmDialog
            open={open}
            onClose={closeDialog}
            field={field}
         />
      </>
   );
};
