import { Metadata } from "next";
import { notFound } from "next/navigation";

import { WorkflowEdit } from "@/components/workflows";
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
         <WorkflowEdit workflow={workflow} usage={usage} />
      </div>
   );
};

export default EditWorkflowPage;
