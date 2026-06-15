"use client";

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
   index: number;
   allSteps: DWorkflowStepUpdate[];
   formVisible: boolean;
   addStep: CallbackFn;
   control: Control<DWorkflowUpdate>;
};

export const StepDetail = ({
   index,
   allSteps,
   formVisible,
   addStep,
   control,
}: Props) => {
   if (formVisible) {
      return <StepForm index={index} allSteps={allSteps} control={control} />;
   }

   return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
         <p className="text-sm text-muted-foreground">
            Wähle links einen Schritt zum Bearbeiten
         </p>
         <Button variant="outline" size="sm" onClick={addStep}>
            <Plus className="mr-2 h-4 w-4" />
            Neuen Schritt erstellen
         </Button>
      </div>
   );
};
