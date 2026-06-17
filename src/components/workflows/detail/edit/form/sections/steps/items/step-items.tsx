"use client";

import { map, some } from "es-toolkit/compat";
import { Star } from "lucide-react";
import { Control } from "react-hook-form";

import {
   DWorkflowStepUpdate,
   DWorkflowUpdate,
} from "@/data/types/domain/workflow";

import { StepItem } from "./step-item.";

type Props = {
   steps: DWorkflowStepUpdate[];
   selectedIndex?: number;
   onSelectStep: (index: number) => void;
   onDeleteStep: (index: number) => void;
   control: Control<DWorkflowUpdate>;
};

export const StepItems = ({
   steps,
   selectedIndex,
   onSelectStep,
   onDeleteStep,
   control,
}: Props) => {
   const hasStart = some(steps, (s) => s.isStart);

   const stepItem = (index: number) => {
      return (
         <StepItem
            key={index}
            index={index}
            allSteps={steps}
            isSelected={index === selectedIndex}
            onSelectStep={onSelectStep}
            onDeleteStep={onDeleteStep}
            control={control}
         />
      );
   };

   return (
      <div className="space-y-2" data-testid="step-list">
         {!hasStart && steps.length > 0 && (
            <div className="flex items-center gap-2 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
               <Star className="h-4 w-4 shrink-0" />
               Kein Startschritt gesetzt
            </div>
         )}

         {map(steps, (_, index) => stepItem(index))}
      </div>
   );
};
