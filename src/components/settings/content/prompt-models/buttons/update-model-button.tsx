"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DPromptModelWithUsage } from "@/data/types/domain/prompt";
import { UpdateModelDialog } from "../dialogs";

type Props = {
   model: DPromptModelWithUsage;
};

export const UpdateModelButton = ({ model }: Props) => {
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
            data-testid="update-model-btn"
         >
            <Pencil className="h-4 w-4" />
         </Button>
         <UpdateModelDialog open={open} onClose={closeDialog} model={model} />
      </>
   );
};
