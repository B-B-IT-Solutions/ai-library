import Link from "next/link";

import { Badge } from "@/components/shadcn/badge";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
} from "@/components/shadcn/card";
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
      <>
         <Card
            ref={ref}
            className="flex flex-col transition-shadow hover:shadow-md"
            data-testid="workflow-item"
         >
            <CardHeader className="pb-2">
               <div className="flex items-start justify-between gap-2">
                  <Link
                     href={viewUrl}
                     className="group/title"
                     data-testid="view-details-link-title"
                  >
                     <h4 className="line-clamp-2 cursor-pointer text-lg leading-tight font-semibold text-slate-900 transition-colors hover:text-blue-700">
                        {workflow.title}
                     </h4>
                  </Link>
               </div>
               {workflow.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                     {workflow.description}
                  </p>
               )}
            </CardHeader>

            <CardContent className="flex-1 pb-2">
               <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">
                     {workflow.stepCount} Schritte
                  </Badge>
               </div>
            </CardContent>

            <CardFooter>
               <RunWorkflowButton workflowId={workflow.id} size="sm" />
               <WorkflowMoreOptionsButton workflow={workflow} />
            </CardFooter>
         </Card>
      </>
   );
};
