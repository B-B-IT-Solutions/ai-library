"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { DWorkflow } from "@/data/types/domain/workflow";

import { DeleteWorkflowButton } from "./delete-workflow-button";
import { EditWorkflowButton } from "./edit-workflow-button";
import { RunWorkflowButton } from "./run-workflow-button";
import { ViewWorkflowButton } from "./view-workflow-button";

type Props = {
   workflow: DWorkflow;
};

export const WorkflowMoreOptionsButton = ({ workflow }: Props) => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const handleContextMenuOpen = (open: boolean) => {
      if (open) {
         setIsMenuOpen(true);
      } else {
         setTimeout(() => setIsMenuOpen(false), 200);
      }
   };

   return (
      <DropdownMenu
         data-testid="workflow-more-options-btn"
         onOpenChange={handleContextMenuOpen}
      >
         <DropdownMenuTrigger asChild={true}>
            <Button
               variant="outline"
               size="sm"
               className="cursor-pointer"
               aria-label="Weitere Optionen"
               title="Weitere Optionen"
               data-state={isMenuOpen && "open"}
               data-testid="more-options-trigger-btn"
            >
               <MoreVertical className="h-4 w-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <ViewWorkflowButton workflow={workflow} />
            <EditWorkflowButton workflow={workflow} asMenuItem={true} />
            <RunWorkflowButton
               workflowId={workflow.id}
               variant="ghost"
               size="sm"
               className="w-full justify-start px-2 py-1.5 font-normal"
            />

            <DropdownMenuSeparator />
            <DeleteWorkflowButton workflow={workflow} asMenuItem={true} />
         </DropdownMenuContent>
      </DropdownMenu>
   );
};
