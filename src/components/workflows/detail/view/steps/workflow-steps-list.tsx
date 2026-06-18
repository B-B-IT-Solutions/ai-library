import { DWorkflowWithSteps } from "@/data/types/domain/workflow";

import { StepCard } from "./step-card";

type Props = {
   workflow: DWorkflowWithSteps;
};

export const WorkflowStepsList = ({ workflow }: Props) => {
   if (workflow.steps.length === 0) {
      return (
         <div
            className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm"
            data-testid="steps-empty"
         >
            Dieser Workflow hat noch keine Schritte.
         </div>
      );
   }

   return (
      <div className="space-y-3" data-testid="workflow-steps">
         {workflow.steps.map((step, index) => (
            <StepCard
               key={step.id}
               step={step}
               index={index}
               allSteps={workflow.steps}
            />
         ))}
      </div>
   );
};

