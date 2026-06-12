import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { WorkflowRunner } from "@/components/workflows";
import { requireUser } from "@/data/actions/auth-utils";
import { getPromptGenerationData } from "@/data/actions/prompt";
import { getWorkflowForRunner } from "@/data/actions/workflow";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DPromptGenerationData } from "@/data/types/domain/prompt";

export const metadata: Metadata = {
   title: "Workflow ausführen",
};

type PageProps = {
   params: Promise<{ id: string }>;
};

const RunWorkflowPage = async ({ params }: PageProps) => {
   const { id } = await params;
   const user = await requireUser();

   const factory = new ServiceFactory(prisma);
   const tier = await factory.getSubscriptionService().getUserTier(user.id);
   if (tier === "FREE") {
      redirect("/subscription/pricing");
   }

   const workflow = await getWorkflowForRunner(id);

   if (!workflow) {
      notFound();
   }

   // Pre-load template data for the start step to avoid client-side waterfall
   const initialTemplateData: Record<string, DPromptGenerationData | null> = {};
   const startStep = workflow.steps.find((s) => s.isStart);
   if (startStep?.type === "PROMPT_REF" && startStep.promptId) {
      try {
         initialTemplateData[startStep.id] = await getPromptGenerationData(
            startStep.promptId
         );
      } catch {
         initialTemplateData[startStep.id] = null;
      }
   }

   return (
      <WorkflowRunner
         workflow={workflow}
         initialTemplateData={initialTemplateData}
      />
   );
};

export default RunWorkflowPage;
