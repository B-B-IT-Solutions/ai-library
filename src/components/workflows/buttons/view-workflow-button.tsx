import { Eye } from "lucide-react";
import Link from "next/link";

import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { DWorkflow } from "@/data/types/domain/workflow";
import { viewWorkflowUrl } from "../utils";

type Props = {
   workflow: DWorkflow;
};

export const ViewWorkflowButton = ({ workflow }: Props) => {
   const href = viewWorkflowUrl(workflow);

   return (
      <DropdownMenuItem
         asChild={true}
         className="cursor-pointer hover:bg-accent"
         data-testid="view-workflow-menu-item"
      >
         <Link href={href}>
            <Eye className="mr-2 h-4 w-4" />
            Ansehen
         </Link>
      </DropdownMenuItem>
   );
};
