import { DWorkflow, DWorkflowsUsage } from "@/data/types/domain/workflow";

import { CreateWorfklowButton } from "./buttons";
import { WorkflowItems } from "./lists";

type Props = {
   workflows: DWorkflow[];
   usage: DWorkflowsUsage;
};

export const WorkflowsDashboard = ({ workflows, usage }: Props) => {
   const isUpgradeRequired = usage.limit !== -1 && usage.current >= usage.limit;

   return (
      <div
         className="flex h-full flex-col bg-slate-50"
         data-testid="workflows-dashboard"
      >
         <div className="flex items-center justify-between border-b bg-white px-6 py-4">
            <div>
               <h1 className="text-2xl font-bold text-slate-900">
                  Meine Workflows
               </h1>
               <p className="mt-1 text-sm text-slate-600">
                  Verbinde mehrere Prompts zu einem geführten Prozess
               </p>
            </div>
            <div className="flex items-center gap-3">
               <CreateWorfklowButton requirePlanUpgrade={isUpgradeRequired} />
            </div>
         </div>

         {/* <PromptsToolbar
               viewMode={viewMode}
               sortBy={sortBy}
               categories={categories}
               models={models}
               collections={collections}
            /> */}

         <div className="flex-1 overflow-y-auto p-6">
            <WorkflowItems workflows={workflows} usage={usage} />
         </div>
      </div>
   );
};
