import { isEmpty } from "es-toolkit/compat";

import { DWorkflowWithSteps } from "@/data/types/domain/workflow";

import { WorkflowStep } from "./step";

type Props = {
   workflow: DWorkflowWithSteps;
};

export const WorkflowSteps = ({ workflow }: Props) => {
   if (isEmpty(workflow.steps)) {
      return (
         <div
            className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm"
            data-testid="workflow-steps-empty"
         >
            Dieser Workflow hat noch keine Schritte.
         </div>
      );
   }

   return (
      <div className="space-y-3" data-testid="workflow-steps">
         {workflow.steps.map((step, index) => (
            <WorkflowStep
               key={step.id}
               step={step}
               index={index}
               steps={workflow.steps}
            />
         ))}
      </div>
   );
};
