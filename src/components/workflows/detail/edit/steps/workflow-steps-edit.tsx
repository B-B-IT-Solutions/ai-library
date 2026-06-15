"use client";

import { FC } from "react";
import { map } from "es-toolkit/compat";
import { GitBranch, Plus } from "lucide-react";
import { Control, FieldArrayWithId } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   WorkflowEditFormValues,
   WorkflowStepFormItem,
} from "@/data/types/domain/workflow";

import { StepEditItem } from "./step-edit-item";

type Props = {
   control: Control<WorkflowEditFormValues>;
   fields: FieldArrayWithId<WorkflowEditFormValues, "steps", "_key">[];
   addStep: (step: WorkflowStepFormItem) => void;
   removeStep: (index: number) => void;
};

export const WorkflowStepsEdit: FC<Props> = ({
   control,
   fields,
   addStep,
   removeStep,
}) => {
   const handleAddStep = () => {
      addStep({
         title: "",
         hint: "",
         type: "STANDALONE",
         content: "",
         isStart: fields.length === 0,
         position: fields.length,
         edges: [],
      });
   };

   return (
      <section className="space-y-4" data-testid="workflow-steps-edit">
         <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
               <GitBranch className="h-5 w-5 text-indigo-600" />
               Schritte
            </h3>
            <p className="mt-1 text-sm text-slate-500">
               Definiere die Schritte deines Workflows.
            </p>
         </div>

         {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
               Noch keine Schritte — füge den ersten Schritt hinzu.
            </p>
         )}

         <div className="space-y-3">
            {map(fields, (field, idx) => (
               <StepEditItem
                  key={field._key}
                  control={control}
                  index={idx}
                  removeStep={removeStep}
                  defaultExpanded={!field.id}
               />
            ))}
         </div>

         <div className="flex justify-end">
            <Button
               type="button"
               variant="outline"
               size="sm"
               onClick={handleAddStep}
               data-testid="add-step-btn"
            >
               <Plus className="h-4 w-4" />
               Schritt hinzufügen
            </Button>
         </div>
      </section>
   );
};
