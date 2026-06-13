"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { UpgradePlanDialog } from "@/components/subscription";
import { newWorkflowUrl } from "../utils";

type Props = {
   size?: "default" | "sm";
   requirePlanUpgrade?: boolean;
};

export const CreateWorfklowButton = ({
   size = "default",
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
               data-testid="create-workflow-btn"
            >
               <Plus className="h-4 w-4" />
               Neuer Workflow
            </Button>
            <UpgradePlanDialog
               open={dialogOpen}
               onOpenChange={setDialogOpen}
               feature="Workflows"
            />
         </>
      );
   }

   const href = newWorkflowUrl();

   return (
      <Button
         asChild={true}
         size={size}
         className="cursor-pointer gap-2 bg-blue-700 hover:bg-blue-800"
         data-testid="create-workflow-btn"
      >
         <Link href={href}>
            <Plus className="h-4 w-4" />
            Neuer Workflow
         </Link>
      </Button>
   );
};
