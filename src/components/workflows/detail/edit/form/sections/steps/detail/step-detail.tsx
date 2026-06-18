"use client";

import { isUndefined } from "es-toolkit";
import { Plus } from "lucide-react";
import { Control } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import { CallbackFn } from "@/data/types/common";
import {
   DWorkflowStepUpdate,
   DWorkflowUpdate,
} from "@/data/types/domain/workflow";

import { StepForm } from "./step-form";

type Props = {
   index?: number;
   steps: DWorkflowStepUpdate[];
   addStep: CallbackFn;
   control: Control<DWorkflowUpdate>;
};

export const StepDetail = ({ index, steps, addStep, control }: Props) => {
   if (isUndefined(index)) {
      return (
         <div
            className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center"
            data-testid="step-not-selected"
         >
            <p className="text-sm text-muted-foreground">
               Wähle links einen Schritt zum Bearbeiten
            </p>
            <Button
               variant="outline"
               size="sm"
               onClick={addStep}
               data-testid="add-step-btn"
            >
               <Plus className="mr-2 h-4 w-4" />
               Neuen Schritt erstellen
            </Button>
         </div>
      );
   }

   return (
      <StepForm key={index} index={index} steps={steps} control={control} />
   );
};
