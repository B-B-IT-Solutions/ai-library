"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DPromptCategoryWithUsage } from "@/data/types/domain/prompt";
import { UpdateCategoryDialog } from "../dialogs";

type Props = {
   category: DPromptCategoryWithUsage;
};

export const UpdateCategoryButton = ({ category }: Props) => {
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
            data-testid="update-category-btn"
         >
            <Pencil className="h-4 w-4" />
         </Button>
         <UpdateCategoryDialog
            open={open}
            onClose={closeDialog}
            category={category}
         />
      </>
   );
};
