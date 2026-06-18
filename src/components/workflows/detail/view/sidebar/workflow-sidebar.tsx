import { format } from "date-fns";

import { DWorkflowWithSteps } from "@/data/types/domain/workflow";
import {
   DeleteWorkflowButton,
   EditWorkflowButton,
   RunWorkflowButton,
} from "../../../buttons";

type Props = {
   workflow: DWorkflowWithSteps;
};

export const WorkflowSidebar = ({ workflow }: Props) => {
   return (
      <aside
         className="space-y-3 lg:sticky lg:top-8 lg:self-start"
         data-testid="workflow-sidebar"
      >
         <RunWorkflowButton
            workflow={workflow}
            className="w-full justify-start py-5 text-sm"
         />
         <div className="space-y-1 pt-1">
            <EditWorkflowButton workflow={workflow} />
            <DeleteWorkflowButton workflow={workflow} />
         </div>
         <div className="space-y-3 border-t border-slate-200 pt-4">
            <div>
               <p className="mb-2 text-xs font-medium text-slate-400">
                  Schritte
               </p>
               <div className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
                  {workflow.stepCount}{" "}
                  {workflow.stepCount === 1 ? "Schritt" : "Schritte"}
               </div>
            </div>
            <div>
               <p className="mb-2 text-xs font-medium text-slate-400">
                  Zuletzt bearbeitet
               </p>
               <div className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
                  {format(new Date(workflow.updatedAt), "dd.MM.yyyy")}
               </div>
            </div>
         </div>
      </aside>
   );
};
