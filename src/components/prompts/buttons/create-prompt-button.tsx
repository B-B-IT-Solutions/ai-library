"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { UpgradePlanDialog } from "@/components/subscription";

type Props = {
   size?: "default" | "sm";
   requirePlanUpgrade?: boolean;
};

export const CreatePromptButton = ({
   size = "default",
   requirePlanUpgrade,
}: Props) => {
   const [dialogOpen, setDialogOpen] = useState(false);

   if (requirePlanUpgrade) {
      return (
         <>
            <Button
               size={size}
               className="cursor-pointer gap-2"
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

   return (
      <Button
         asChild={true}
         size={size}
         className="cursor-pointer gap-2"
         data-testid="create-prompt-btn"
      >
         <Link href="/templates/new">
            <Plus className="h-4 w-4" />
            Neuer Prompt
         </Link>
      </Button>
   );
};
