"use client";

import { useState } from "react";
import { map, some } from "es-toolkit/compat";
import { Star } from "lucide-react";

import { DWorkflowStepUpdate } from "@/data/types/domain/workflow";

import { StepItem } from "./step-item.";

type Props = {
   steps: DWorkflowStepUpdate[];

   onSelectStep: (step: DWorkflowStepUpdate, index: number) => void;
   onDeleteStep: (index: number) => void;
};

export const StepItems = ({ steps, onSelectStep, onDeleteStep }: Props) => {
   const [selectedIndex, setSelectedIndex] = useState(-1);

   const hasStart = some(steps, (s) => s.isStart);

   const stepItem = (step: DWorkflowStepUpdate, index: number) => {
      return (
         <StepItem
            key={index}
            step={step}
            index={index}
            allSteps={steps}
            isSelected={index === selectedIndex}
            onSelectStep={(step, index) => {
               setSelectedIndex(index);
               onSelectStep(step, index);
            }}
            onDeleteStep={onDeleteStep}
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

         {map(steps, (step, idx) => stepItem(step, idx))}
      </div>
   );
};
