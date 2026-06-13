import { Metadata } from "next";

import { WorkflowEditor } from "@/components/workflows";
import { getWorkflowsUsage } from "@/data/actions/workflow";

export const metadata: Metadata = {
   title: "Neuer Workflow",
};

const NewWorkflowPage = async () => {
   const usage = await getWorkflowsUsage();

   return (
      <div data-testid="new-workflow-page" className="h-full">
         <WorkflowEditor usage={usage} />
      </div>
   );
};

export default NewWorkflowPage;
