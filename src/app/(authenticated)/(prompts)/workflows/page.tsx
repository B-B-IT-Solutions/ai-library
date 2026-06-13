import { Metadata } from "next";

import { WorkflowsDashboard } from "@/components/workflows";
import { getWorkflows, getWorkflowsUsage } from "@/data/actions/workflow";

export const metadata: Metadata = {
   title: "Workflows",
};

const WorkflowsPage = async () => {
   const [workflows, usage] = await Promise.all([
      getWorkflows(),
      getWorkflowsUsage(),
   ]);

   return (
      <div data-testid="workflows-page" className="h-full">
         <WorkflowsDashboard workflows={workflows} usage={usage} />
      </div>
   );
};

export default WorkflowsPage;
