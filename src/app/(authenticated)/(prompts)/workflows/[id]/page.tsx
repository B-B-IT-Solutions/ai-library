import { Metadata } from "next";
import { notFound } from "next/navigation";

import { WorkflowEdit } from "@/components/workflows";
import { getWorkflowWithSteps } from "@/data/actions/workflow";

export const metadata: Metadata = {
   title: "Workflow",
};

type PageProps = {
   params: Promise<{ id: string }>;
};

export const WorkflowPage = async ({ params }: PageProps) => {
   const { id } = await params;

   const [workflow] = await Promise.all([getWorkflowWithSteps(id)]);

   if (!workflow) {
      return notFound();
   }

   return (
      <div data-testid="workflow-page" className="h-full">
         <WorkflowEdit workflow={workflow} />
      </div>
   );
};

export default WorkflowPage;
