import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { WorkflowEditor } from "@/components/workflows";
import { requireUser } from "@/data/actions/auth-utils";
import { getWorkflow, getWorkflowsUsage } from "@/data/actions/workflow";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";

export const metadata: Metadata = {
   title: "Workflow bearbeiten",
};

type PageProps = {
   params: Promise<{ id: string }>;
};

const EditWorkflowPage = async ({ params }: PageProps) => {
   const { id } = await params;
   const user = await requireUser();

   const factory = new ServiceFactory(prisma);
   const tier = await factory.getSubscriptionService().getUserTier(user.id);
   if (tier === "FREE") {
      redirect("/subscription/pricing");
   }

   const [workflow, usage] = await Promise.all([
      getWorkflow(id),
      getWorkflowsUsage(),
   ]);

   if (!workflow) {
      notFound();
   }

   return (
      <div data-testid="edit-workflow-page" className="h-full">
         <WorkflowEditor initialWorkflow={workflow} usage={usage} />
      </div>
   );
};

export default EditWorkflowPage;
