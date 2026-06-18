"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/shadcn/dialog";
import { getPromptGenerationData } from "@/data/actions/prompt";
import { DPromptGenerationData } from "@/data/types/domain/prompt";
import { DWorkflowWithSteps } from "@/data/types/domain/workflow";
import { WorkflowRunner } from "../runner/workflow-runner";

type TemplateDataCache = Record<string, DPromptGenerationData | null>;

type Props = {
   workflow: DWorkflowWithSteps;
   onClose: () => void;
};

export const WorkflowRunnerDialog = ({ workflow, onClose }: Props) => {
   const [templateData, setTemplateData] = useState<TemplateDataCache | null>(
      null
   );

   useEffect(() => {
      const load = async () => {
         const cache: TemplateDataCache = {};
         const startStep = workflow.steps.find((s) => s.isStart);
         if (startStep?.type === "PROMPT_REF" && startStep.promptId) {
            try {
               cache[startStep.edgeId] = await getPromptGenerationData(
                  startStep.promptId
               );
            } catch {
               cache[startStep.edgeId] = null;
            }
         }
         setTemplateData(cache);
      };
      load();
   }, [workflow]);

   return (
      <Dialog open onOpenChange={onClose}>
         <DialogContent
            showCloseButton={false}
            className="h-screen max-h-screen w-screen gap-0 overflow-hidden p-0 sm:max-w-none"
         >
            <DialogTitle className="sr-only">{workflow.title}</DialogTitle>
            {templateData === null ? (
               <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
               </div>
            ) : (
               <WorkflowRunner
                  workflow={workflow}
                  initialTemplateData={templateData}
                  onClose={onClose}
               />
            )}
         </DialogContent>
      </Dialog>
   );
};
