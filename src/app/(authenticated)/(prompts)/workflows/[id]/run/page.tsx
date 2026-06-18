import { Metadata } from "next";
import { notFound } from "next/navigation";

import { WorkflowRunner } from "@/components/workflows";
import { getPromptGenerationData } from "@/data/actions/prompt";
import { getWorkflowForRunner } from "@/data/actions/workflow";
import { DPromptGenerationData } from "@/data/types/domain/prompt";

export const metadata: Metadata = {
   title: "Workflow ausführen",
};

type PageProps = {
   params: Promise<{ id: string }>;
};

const RunWorkflowPage = async ({ params }: PageProps) => {
   const { id } = await params;

   const workflow = await getWorkflowForRunner(id);

   if (!workflow) {
      return notFound();
   }

   // Pre-load template data for the start step to avoid client-side waterfall
   const initialTemplateData: Record<string, DPromptGenerationData | null> = {};
   const startStep = workflow.steps.find((s) => s.isStart);
   if (startStep?.type === "PROMPT_REF" && startStep.promptId) {
      try {
         initialTemplateData[startStep.edgeId] = await getPromptGenerationData(
            startStep.promptId
         );
      } catch {
         initialTemplateData[startStep.edgeId] = null;
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
