import { Metadata } from "next";
import { redirect } from "next/navigation";

import { WorkflowEditor } from "@/components/workflows";
import { requireUser } from "@/data/actions/auth-utils";
import { getWorkflowsUsage } from "@/data/actions/workflow";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";

export const metadata: Metadata = {
   title: "Neuer Workflow",
};

const NewWorkflowPage = async () => {
   const user = await requireUser();

   const factory = new ServiceFactory(prisma);
   const tier = await factory.getSubscriptionService().getUserTier(user.id);
   if (tier === "FREE") {
      redirect("/subscription/pricing");
   }

   const usage = await getWorkflowsUsage();

   return (
      <div data-testid="new-workflow-page" className="h-full">
         <WorkflowEditor initialWorkflow={null} usage={usage} />
      </div>
   );
};

export default NewWorkflowPage;
