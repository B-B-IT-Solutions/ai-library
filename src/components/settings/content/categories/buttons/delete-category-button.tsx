"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DPromptCategoryUsage } from "@/data/types/domain/prompt";
import { DeleteCategoryDialog } from "../dialogs";

type Props = {
   category: DPromptCategoryUsage;
};

export const DeleteCategoryButton = ({ category }: Props) => {
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
            data-testid="delete-category-btn"
         >
            <Trash2 className="h-4 w-4 text-destructive" />
         </Button>
         <DeleteCategoryDialog
            open={open}
            onClose={closeDialog}
            category={category}
         />
      </>
   );
};
