"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DPromptModelWithUsage } from "@/data/types/domain/prompt";
import { DeleteModelDialog } from "../dialogs";

type Props = {
   model: DPromptModelWithUsage;
};

export const DeleteModelButton = ({ model }: Props) => {
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
            data-testid="delete-model-btn"
         >
            <Trash2 className="h-4 w-4 text-destructive" />
         </Button>
         <DeleteModelDialog open={open} onClose={closeDialog} model={model} />
      </>
   );
};
