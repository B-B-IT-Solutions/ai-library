"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, X } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/shadcn/dialog";
import { getPromptGenerationData } from "@/data/actions/prompt";
import { DPromptGenerationData } from "@/data/types/domain/prompt";
import { DWorkflowWithSteps } from "@/data/types/domain/workflow";
import { WorkflowRunner } from "../runner/workflow-runner";

import { LoadingWorkflowData } from "./loading-data";

type TemplateDataCache = Record<string, DPromptGenerationData | null>;
type LoadStatus = "loading" | "ready" | "error";

type Props = {
   workflow: DWorkflowWithSteps;
   onClose: () => void;
};

const ErrorState = ({
   onRetry,
   onClose,
}: {
   onRetry: () => void;
   onClose: () => void;
}) => (
   <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <div>
         <h2 className="text-lg font-semibold text-foreground">
            Fehler beim Laden
         </h2>
         <p className="mt-1 text-sm text-muted-foreground">
            Der Workflow konnte nicht vorbereitet werden.
         </p>
      </div>
      <div className="flex gap-3">
         <Button variant="outline" onClick={onClose}>
            Schließen
         </Button>
         <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Erneut versuchen
         </Button>
      </div>
   </div>
);

export const WorkflowRunnerDialog = ({ workflow, onClose }: Props) => {
   const [templateData, setTemplateData] = useState<TemplateDataCache | null>(
      null
   );
   const [status, setStatus] = useState<LoadStatus>("loading");

   const load = useCallback(async () => {
      setStatus("loading");
      setTemplateData(null);
      try {
         const cache: TemplateDataCache = {};
         const startStep = workflow.steps.find((s) => s.isStart);
         if (startStep?.type === "PROMPT_REF" && startStep.promptId) {
            cache[startStep.edgeId] = await getPromptGenerationData(
               startStep.promptId
            );
         }
         setTemplateData(cache);
         setStatus("ready");
      } catch {
         setStatus("error");
      }
   }, [workflow]);

   useEffect(() => {
      load();
   }, [load]);

   return (
      <Dialog open onOpenChange={onClose} data-testid="run-workflow-dialog">
         <DialogContent
            showCloseButton={false}
            className="overflow-hidden p-0 sm:max-w-none"
         >
            <DialogTitle className="sr-only">{workflow.title} </DialogTitle>
            <div className="flex items-center justify-between border-b bg-background px-6 py-3">
               <h1 className="font-semibold text-foreground">
                  {workflow.title}
               </h1>
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  data-testid="runner-close-btn"
               >
                  <X className="mr-1 h-4 w-4" />
               </Button>
            </div>
            {status === "loading" && <LoadingWorkflowData />}
            {status === "error" && (
               <ErrorState onRetry={load} onClose={onClose} />
            )}
            {status === "ready" && templateData !== null && (
               <WorkflowRunner
                  workflow={workflow}
                  initialTemplateData={templateData}
               />
            )}
         </DialogContent>
      </Dialog>
   );
};
