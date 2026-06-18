"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/shadcn/dialog";
import { Skeleton } from "@/components/shadcn/skeleton";
import { getPromptGenerationData } from "@/data/actions/prompt";
import { DPromptGenerationData } from "@/data/types/domain/prompt";
import { DWorkflowWithSteps } from "@/data/types/domain/workflow";
import { WorkflowRunner } from "../runner/workflow-runner";

type TemplateDataCache = Record<string, DPromptGenerationData | null>;
type LoadStatus = "loading" | "ready" | "error";

type Props = {
   workflow: DWorkflowWithSteps;
   onClose: () => void;
};

const LoadingSkeleton = () => (
   <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-background px-6 py-3">
         <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-5 w-px" />
            <Skeleton className="h-5 w-52" />
         </div>
         <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-2 border-b bg-muted/50 px-6 pt-2.5 pb-2">
         <Skeleton className="h-3 w-24" />
         <Skeleton className="h-1 w-full rounded-full" />
         <Skeleton className="h-3.5 w-32" />
      </div>
      <div className="flex-1 p-6">
         <div className="mx-auto max-w-3xl space-y-5">
            <div className="space-y-3 rounded-xl border bg-card p-6">
               <Skeleton className="h-7 w-56" />
               <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-40 w-full rounded-xl" />
         </div>
      </div>
      <div className="space-y-3 border-t bg-background px-6 py-4">
         <Skeleton className="h-4 w-40" />
         <div className="flex gap-3">
            <Skeleton className="h-11 w-44 rounded-lg" />
            <Skeleton className="h-11 w-44 rounded-lg" />
         </div>
      </div>
   </div>
);

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
            className="h-screen max-h-screen w-screen gap-0 overflow-hidden p-0 sm:max-w-none"
         >
            <DialogTitle className="sr-only">{workflow.title}</DialogTitle>
            {status === "loading" && <LoadingSkeleton />}
            {status === "error" && (
               <ErrorState onRetry={load} onClose={onClose} />
            )}
            {status === "ready" && templateData !== null && (
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
