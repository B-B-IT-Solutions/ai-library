"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { UpgradePlanDialog } from "@/components/subscription";

type Props = {
   size?: "default" | "sm";
   atLimit?: boolean;
};

export const CreateTemplateButton = ({
   size = "default",
   atLimit = false,
}: Props) => {
   const [dialogOpen, setDialogOpen] = useState(false);

   if (atLimit) {
      return (
         <>
            <Button
               size={size}
               className="cursor-pointer gap-2"
               onClick={() => setDialogOpen(true)}
               data-testid="create-prompt-btn"
            >
               <Plus className="h-4 w-4" />
               Neue Vorlage
            </Button>
            <UpgradePlanDialog
               open={dialogOpen}
               onOpenChange={setDialogOpen}
               featureLabel="Vorlagen"
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
            Neue Vorlage
         </Link>
      </Button>
   );
};
