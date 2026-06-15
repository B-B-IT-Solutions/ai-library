"use client";

import { Control, useWatch } from "react-hook-form";

import {
   DWorkflowStepUpdate,
   DWorkflowUpdate,
} from "@/data/types/domain/workflow";

import { StepForm } from "./step-form";

type Props = {
   index: number;
   allSteps: DWorkflowStepUpdate[];
   onCreateMode?: boolean;
   control: Control<DWorkflowUpdate>;
};

export const StepDetail = ({
   index,
   allSteps,
   onCreateMode = false,
   control,
}: Props) => {
   const { title } = useWatch({
      name: `steps.${index}`,
      control,
   });

   return (
      <div
         className="flex h-full flex-col overflow-y-auto"
         data-testid="step-detail-panel"
      ></div>
   );
};
