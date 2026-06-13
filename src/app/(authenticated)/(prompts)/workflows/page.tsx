import { Metadata } from "next";

import { WorkflowsDashboard } from "@/components/workflows";

export const metadata: Metadata = {
   title: "Workflows",
};

const WorkflowsPage = async () => {
   return (
      <div data-testid="workflows-page" className="h-full">
         <WorkflowsDashboard />
      </div>
   );
};

export default WorkflowsPage;
