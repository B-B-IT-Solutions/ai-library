import { Metadata } from "next";

import { WorkflowEdit } from "@/components/workflows";
import { getWorkflowsUsage } from "@/data/actions/workflow";

export const metadata: Metadata = {
   title: "Neuer Workflow",
};

export const NewWorkflowPage = async () => {
   const usage = await getWorkflowsUsage();

   return (
      <div data-testid="new-workflow-page" className="h-full">
         <WorkflowEdit usage={usage} />
      </div>
   );
};

export default NewWorkflowPage;
