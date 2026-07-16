"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { CreateCategoryDialog } from "../dialogs";

export const CreateCategoryButton = () => {
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
            data-testid="create-category-btn"
         >
            <Plus className="mr-1 h-4 w-4" />
            Kategorie hinzufügen
         </Button>
         <CreateCategoryDialog open={open} onClose={closeDialog} />
      </>
   );
};
