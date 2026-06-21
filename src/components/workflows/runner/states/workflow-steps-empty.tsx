"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { DWorkflowWithSteps } from "@/data/types/domain/workflow";
import { editWorkflowUrl } from "../../utils";

type Props = {
   workflow: DWorkflowWithSteps;
   message: string;
};

export const WorklowStepsEmpty = ({ workflow, message }: Props) => {
   const url = editWorkflowUrl(workflow);
   return (
      <div
         className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center"
         data-testid="workflow-steps-empty"
      >
         <AlertTriangle className="h-12 w-12 text-yellow-500" />
         <h2 className="text-xl font-semibold">{message}</h2>
         <Button asChild={true} data-testid="workflow-edit-btn">
            <Link href={url}>Zum Editor</Link>
         </Button>
      </div>
   );
};
