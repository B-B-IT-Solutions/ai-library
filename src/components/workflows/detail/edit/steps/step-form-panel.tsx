"use client";

import { Control } from "react-hook-form";

import {
   DWorkflowStepUpdate,
   DWorkflowUpdate,
} from "@/data/types/domain/workflow";

import { StepForm } from "./step-form";

type Props = {
   index: number;
   step?: DWorkflowStepUpdate;
   allSteps: DWorkflowStepUpdate[];
   onCreateMode?: boolean;
   control: Control<DWorkflowUpdate>;
};

export const StepFormPanel = ({
   index,
   step,
   allSteps,
   onCreateMode = false,
   control,
}: Props) => {
   return (
      <div
         className="flex h-full flex-col overflow-y-auto"
         data-testid="step-detail-panel"
      >
         <div className="shrink-0 border-b bg-white px-5 py-4">
            <div className="flex items-center gap-2">
               <h2 className="font-semibold text-slate-900">
                  {onCreateMode ? "Neuer Schritt" : "Schritt bearbeiten"}
               </h2>
            </div>
            {step?.title && !onCreateMode && (
               <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {step.title}
               </p>
            )}
         </div>

         <StepForm
            key={index}
            index={index}
            allSteps={allSteps}
            control={control}
         />
      </div>
   );
};
