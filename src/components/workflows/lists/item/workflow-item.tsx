import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { DWorkflow } from "@/data/types/domain/workflow";
import { RunWorkflowButton, WorkflowMoreOptionsButton } from "../../buttons";
import { viewWorkflowUrl } from "../../utils";

type Props = {
   workflow: DWorkflow;
   ref?: React.Ref<HTMLDivElement>;
};

export const WorkflowItem = ({ workflow, ref }: Props) => {
   const viewUrl = viewWorkflowUrl(workflow);
   return (
      <Card
         ref={ref}
         className="group relative flex flex-col gap-0 rounded-lg border border-slate-300 bg-white p-0 transition-all duration-200 hover:border-slate-400 hover:shadow-md"
         data-testid="workflow-item"
      >
         <CardHeader className="gap-2 p-5 pb-3">
            <div className="flex items-start justify-between gap-2">
               <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                  {workflow.stepCount} Schritte
               </span>
            </div>
            <Link
               href={viewUrl}
               className="group/title"
               data-testid="view-details-link-title"
            >
               <h4 className="line-clamp-2 cursor-pointer text-lg leading-tight font-semibold text-slate-900 transition-colors hover:text-blue-700">
                  {workflow.title}
               </h4>
            </Link>
         </CardHeader>

         <CardContent className="flex-1 px-5 pt-0 pb-3">
            {workflow.description && (
               <p className="line-clamp-3 text-sm leading-relaxed text-slate-700">
                  {workflow.description}
               </p>
            )}
         </CardContent>

         <div className="flex items-center justify-end border-t border-slate-200 px-5 py-3">
            <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 has-[button:disabled]:opacity-100 has-[button[data-state=open]]:opacity-100">
               <RunWorkflowButton workflowId={workflow.id} size="sm" />
               <WorkflowMoreOptionsButton workflow={workflow} />
            </div>
         </div>
      </Card>
   );
};
