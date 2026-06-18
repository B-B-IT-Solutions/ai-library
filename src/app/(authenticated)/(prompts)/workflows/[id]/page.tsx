import { Metadata } from "next";
import { notFound } from "next/navigation";

import { WorkflowView } from "@/components/workflows";
import { getWorkflowWithSteps } from "@/data/actions/workflow";

export const metadata: Metadata = {
   title: "Workflow",
};

export type PageParams = {
   id: string;
};

export type PageProps = {
   params: Promise<PageParams>;
};

export const WorkflowPage = async ({ params }: PageProps) => {
   const { id } = await params;

   const [workflow] = await Promise.all([getWorkflowWithSteps(id)]);

   if (!workflow) {
      return notFound();
   }

   return (
      <div data-testid="workflow-page" className="h-full">
         <WorkflowView workflow={workflow} />
      </div>
   );
};

export default WorkflowPage;
