"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { GlobalTemplateFieldEditDialog } from "../dialogs";

export const AddTemplateFieldButton = () => {
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
            variant="outline"
            size="sm"
            onClick={openDialog}
            className="cursor-pointer"
            data-testid="add-template-field-btn"
         >
            <Plus className="mr-1 h-4 w-4" />
            Feld hinzufügen
         </Button>
         <GlobalTemplateFieldEditDialog open={open} onClose={closeDialog} />
      </>
   );
};
