"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { GlobalPromptFieldEditDialog } from "../dialogs";

type Props = {
   field: DGlobalPromptField;
};

export const EditTemplateFieldButton = ({ field }: Props) => {
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
            data-testid="edit-template-field-btn"
         >
            <Pencil className="h-4 w-4" />
         </Button>
         <GlobalPromptFieldEditDialog
            open={open}
            onClose={closeDialog}
            field={field}
         />
      </>
   );
};
