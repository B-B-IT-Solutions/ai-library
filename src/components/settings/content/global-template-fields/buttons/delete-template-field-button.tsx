"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { GlobalPromptFieldDeleteConfirmDialog } from "../dialogs";

type Props = {
   field: DGlobalPromptField;
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
         <GlobalPromptFieldDeleteConfirmDialog
            open={open}
            onClose={closeDialog}
            field={field}
         />
      </>
   );
};
