import { DWorkflowWithSteps } from "@/data/types/domain/workflow";
import { WorkflowBreadcrumb } from "../../breadcrumbs";

import { WorkflowSidebar } from "./sidebar";
import { WorkflowSteps } from "./steps";

type Props = {
   workflow: DWorkflowWithSteps;
};

export const WorkflowView = ({ workflow }: Props) => {
   return (
      <div
         className="flex h-full flex-col bg-slate-50"
         data-testid="workflow-view"
      >
         <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-slate-200 bg-white px-6">
            <WorkflowBreadcrumb variant="view" label={workflow.title} />
         </div>

         <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-6 py-8">
               <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
                  <div className="space-y-6" data-testid="workflow-view-body">
                     <div
                        className="rounded-xl bg-white p-6 shadow-sm"
                        data-testid="workflow-info"
                     >
                        <h1 className="text-2xl font-bold text-slate-900">
                           {workflow.title}
                        </h1>
                        {workflow.description && (
                           <p className="mt-2 text-sm text-slate-600">
                              {workflow.description}
                           </p>
                        )}
                     </div>
                     <WorkflowSteps workflow={workflow} />
                  </div>

                  <WorkflowSidebar workflow={workflow} />
               </div>
            </div>
         </div>
      </div>
   );
};
