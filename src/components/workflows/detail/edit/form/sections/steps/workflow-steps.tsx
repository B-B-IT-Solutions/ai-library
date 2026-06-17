"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   DWorkflowStepUpdate,
   DWorkflowUpdate,
} from "@/data/types/domain/workflow";
import { initWorkflowStep } from "../../utils";

import { StepDetail } from "./detail/step-detail";
import { StepItems } from "./items";

type Props = {
   control: Control<DWorkflowUpdate>;
};

export const WorkflowSteps = ({ control }: Props) => {
   const [selectedStepIndex, setSelectedStepIndex] = useState<
      number | undefined
   >();

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

            <StepItems
               steps={steps}
               selectedIndex={selectedStepIndex}
               onSelectStep={setSelectedStepIndex}
               onDeleteStep={handleRemoveStep}
               control={control}
            />
         </div>

         <div className="overflow-y-auto bg-white">
            <StepDetail
               index={selectedStepIndex}
               steps={steps}
               addStep={handleAddStep}
               control={control}
            />
         </div>
      </div>
   );
};
