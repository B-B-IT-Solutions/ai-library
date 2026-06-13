import { Metadata } from "next";
import { SearchParams } from "nuqs";

import { WorkflowsDashboard } from "@/components/workflows";

export const metadata: Metadata = {
   title: "Meine Workflows",
};

export type PageProps = {
   searchParams: Promise<SearchParams>;
};

export const WorkflowsPage = async (props: PageProps) => {
   return (
      <div data-testid="workflows-page" className="h-full">
         <WorkflowsDashboard />
      </div>
   );
};

export default WorkflowsPage;
