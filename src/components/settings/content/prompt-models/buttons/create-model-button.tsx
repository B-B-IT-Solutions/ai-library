"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { CreateModelDialog } from "../dialogs";

export const CreateModelButton = () => {
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
            data-testid="create-model-btn"
         >
            <Plus className="mr-1 h-4 w-4" />
            Modell hinzufügen
         </Button>
         <CreateModelDialog open={open} onClose={closeDialog} />
      </>
   );
};
