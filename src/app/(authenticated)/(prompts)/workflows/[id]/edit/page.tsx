import { Metadata } from "next";
import { notFound } from "next/navigation";

import { WorkflowEditor } from "@/components/workflows";
import {
   getWorkflowsUsage,
   getWorkflowWithSteps,
} from "@/data/actions/workflow";

export const metadata: Metadata = {
   title: "Workflow bearbeiten",
};

type PageProps = {
   params: Promise<{ id: string }>;
};

const EditWorkflowPage = async ({ params }: PageProps) => {
   const { id } = await params;

   const [workflow, usage] = await Promise.all([
      getWorkflowWithSteps(id),
      getWorkflowsUsage(),
   ]);

   if (!workflow) {
      return notFound();
   }

   return (
      <div data-testid="edit-workflow-page" className="h-full">
         <WorkflowEditor initialWorkflow={workflow} usage={usage} />
      </div>
   );
};

export default EditWorkflowPage;
