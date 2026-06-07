"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { UpgradePlanDialog } from "@/components/subscription";
import { DCollection } from "@/data/types/domain/collection";
import { newPromptUrl } from "../utils";

type Props = {
   size?: "default" | "sm";
   collection?: DCollection;
   requirePlanUpgrade?: boolean;
};

export const CreatePromptButton = ({
   size = "default",
   collection,
   requirePlanUpgrade,
}: Props) => {
   const [dialogOpen, setDialogOpen] = useState(false);

   if (requirePlanUpgrade) {
      return (
         <>
            <Button
               size={size}
               className="cursor-pointer gap-2 bg-blue-700 hover:bg-blue-800"
               onClick={() => setDialogOpen(true)}
               data-testid="create-prompt-btn"
            >
               <Plus className="h-4 w-4" />
               Neuer Prompt
            </Button>
            <UpgradePlanDialog
               open={dialogOpen}
               onOpenChange={setDialogOpen}
               feature="Prompts"
            />
         </>
      );
   }

   const href = newPromptUrl(collection);

   return (
      <Button
         asChild={true}
         size={size}
         className="cursor-pointer gap-2 bg-blue-700 hover:bg-blue-800"
         data-testid="create-prompt-btn"
      >
         <Link href={href}>
            <Plus className="h-4 w-4" />
            Neuer Prompt
         </Link>
      </Button>
   );
};
