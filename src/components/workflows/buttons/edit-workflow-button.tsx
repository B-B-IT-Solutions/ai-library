import { Edit2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { DWorkflow } from "@/data/types/domain/workflow";
import { editWorkflowUrl } from "../utils";

type Props = {
   workflow: DWorkflow;
   asMenuItem?: boolean;
};

export const EditWorkflowButton = ({ workflow, asMenuItem }: Props) => {
   const href = editWorkflowUrl(workflow);

   const label = () => {
      return (
         <>
            <Edit2 className="mr-2 h-4 w-4" />
            Bearbeiten
         </>
      );
   };

   if (asMenuItem) {
      return (
         <DropdownMenuItem
            asChild={true}
            className="cursor-pointer hover:bg-accent"
            data-testid="edit-workflow-menu-item"
         >
            <Link href={href}>{label()}</Link>
         </DropdownMenuItem>
      );
   }

   return (
      <Button
         asChild={true}
         variant="outline"
         className="w-full cursor-pointer justify-start"
         data-testid="edit-workflow-btn"
      >
         <Link href={href}>{label()}</Link>
      </Button>
   );
};
