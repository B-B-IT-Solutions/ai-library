"use client";

import { useState } from "react";
import { map, some } from "es-toolkit/compat";
import { Plus, Star } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   DWorkflowStepUpdate,
   DWorkflowUpdate,
} from "@/data/types/domain/workflow";
import { initWorkflowStep } from "../utils";

import { StepDetail } from "./step-detail";
import { StepItem } from "./step-item.";

type Props = {
   control: Control<DWorkflowUpdate>;
};

export const WorkflowSteps = ({ control }: Props) => {
   const [selectedStep, setSelectedStep] = useState<
      DWorkflowStepUpdate | undefined
   >();
   const [selectedStepIndex, setSelectedStepIndex] = useState(0);

   const {
      fields: steps,
      append: addStep,
      remove: removeStep,
   } = useFieldArray({
      control: control,
      name: "steps",
      keyName: "_key",
   });

   const handleAddStep = () => {
      const newStep: DWorkflowStepUpdate = initWorkflowStep();
      addStep(newStep);
   };

   const handleRemoveStep = (index: number) => {
      removeStep(index);
   };

   const hasStart = some(steps, (s) => s.isStart);

   return (
      <div
         className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
         data-testid="workflow-steps"
      >
         <div className="flex flex-col gap-4 overflow-y-auto bg-slate-50 p-4">
            <Button
               variant="outline"
               className="w-full"
               onClick={handleAddStep}
               data-testid="add-step-btn"
            >
               <Plus className="mr-2 h-4 w-4" />
               Schritt hinzufügen
            </Button>

            <div className="space-y-2" data-testid="step-list">
               {!hasStart && steps.length > 0 && (
                  <div className="flex items-center gap-2 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
                     <Star className="h-4 w-4 shrink-0" />
                     Kein Startschritt gesetzt
                  </div>
               )}

               {map(steps, (step, idx) => {
                  return (
                     <StepItem
                        key={idx}
                        step={step}
                        index={idx}
                        allSteps={steps}
                        isSelected={step.edgeId === selectedStep?.edgeId}
                        onSelectStep={(step, index) => {
                           setSelectedStepIndex(index);
                           setSelectedStep(step);
                        }}
                        onDeleteStep={handleRemoveStep}
                     />
                  );
               })}
            </div>
         </div>

         <div className="overflow-y-auto bg-white">
            <StepDetail
               index={selectedStepIndex}
               formVisible={!!selectedStep}
               allSteps={steps}
               addStep={handleAddStep}
               control={control}
            />
         </div>
      </div>
   );
};
