"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { GlobalTemplateFieldEditDialog } from "../dialogs";

type Props = {
   field: DGlobalTemplateField;
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
         <GlobalTemplateFieldEditDialog
            open={open}
            onClose={closeDialog}
            field={field}
         />
      </>
   );
};
