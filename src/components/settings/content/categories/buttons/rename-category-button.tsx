"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DPromptCategoryUsage } from "@/data/types/domain/prompt";
import { RenameCategoryDialog } from "../dialogs";

type Props = {
   category: DPromptCategoryUsage;
};

export const RenameCategoryButton = ({ category }: Props) => {
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
            data-testid="rename-category-btn"
         >
            <Pencil className="h-4 w-4" />
         </Button>
         <RenameCategoryDialog
            open={open}
            onClose={closeDialog}
            category={category}
         />
      </>
   );
};
