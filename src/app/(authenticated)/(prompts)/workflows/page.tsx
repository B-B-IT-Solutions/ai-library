import { Metadata } from "next";
import { redirect } from "next/navigation";

import { WorkflowsList } from "@/components/workflows";
import { requireUser } from "@/data/actions/auth-utils";
import { getWorkflows, getWorkflowsUsage } from "@/data/actions/workflow";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";

export const metadata: Metadata = {
   title: "Workflows",
};

const WorkflowsPage = async () => {
   const user = await requireUser();

   // FREE-tier guard — redirect to pricing
   const factory = new ServiceFactory(prisma);
   const tier = await factory.getSubscriptionService().getUserTier(user.id);
   if (tier === "FREE") {
      redirect("/subscription/pricing");
   }

   const [workflows, usage] = await Promise.all([
      getWorkflows(),
      getWorkflowsUsage(),
   ]);

   return (
      <div data-testid="workflows-page" className="h-full">
         <WorkflowsList initialWorkflows={workflows} usage={usage} />
      </div>
   );
};

export default WorkflowsPage;
