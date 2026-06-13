"use client";

import { useState } from "react";
import { AlertTriangle, ArrowLeft, ChevronRight, Info, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { UsePromptForm } from "@/components/prompt-templating/use-prompt/use-prompt-form";
import { MDRenderer } from "@/components/shared/md";
import { CopyButton } from "@/components/shared/buttons";
import { getPromptGenerationData } from "@/data/actions/prompt";
import { DPromptGenerationData } from "@/data/types/domain/prompt";
import {
   DWorkflowWithSteps,
   DWorkflowStep,
} from "@/data/types/domain/workflow";

type RunnerState = {
   historyStack: string[];
   currentIndex: number;
};

type TemplateDataCache = Record<string, DPromptGenerationData | null>;

type Props = {
   workflow: DWorkflowWithSteps;
   initialTemplateData: TemplateDataCache;
};

export const WorkflowRunner = ({ workflow, initialTemplateData }: Props) => {
   const router = useRouter();

   const startStep = workflow.steps.find((s) => s.isStart);

   const [state, setState] = useState<RunnerState>(() => ({
      historyStack: startStep ? [startStep.id] : [],
      currentIndex: 0,
   }));

   const [templateDataCache, setTemplateDataCache] =
      useState<TemplateDataCache>(initialTemplateData);

   const currentStepId = state.historyStack[state.currentIndex];
   const currentStep = workflow.steps.find((s) => s.id === currentStepId);
   const outgoingEdges = currentStep?.outgoingEdges ?? [];
   const isCompleted = outgoingEdges.length === 0 && !!currentStep;
   const canGoBack = state.currentIndex > 0;

   const handleChooseEdge = async (toStepId: string) => {
      // Load template data lazily if needed
      if (!templateDataCache[toStepId]) {
         const nextStep = workflow.steps.find((s) => s.id === toStepId);
         if (nextStep?.type === "PROMPT_REF" && nextStep.promptId) {
            try {
               const data = await getPromptGenerationData(nextStep.promptId);
               setTemplateDataCache((prev) => ({
                  ...prev,
                  [toStepId]: data,
               }));
            } catch {
               // ignore
            }
         }
      }

      setState((prev) => {
         const newStack = prev.historyStack.slice(0, prev.currentIndex + 1);
         newStack.push(toStepId);
         return { historyStack: newStack, currentIndex: prev.currentIndex + 1 };
      });
   };

   const handleBack = () => {
      setState((prev) => ({
         ...prev,
         currentIndex: Math.max(0, prev.currentIndex - 1),
      }));
   };

   const handleRestart = () => {
      setState({
         historyStack: startStep ? [startStep.id] : [],
         currentIndex: 0,
      });
   };

   if (!startStep) {
      return (
         <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
            <h2 className="text-xl font-semibold">
               Kein Startschritt definiert
            </h2>
            <p className="text-muted-foreground">
               Dieser Workflow hat keinen Startschritt. Bitte definiere einen
               Startschritt im Editor.
            </p>
            <Button asChild>
               <Link href={`/workflows/${workflow.id}/edit`}>Zum Editor</Link>
            </Button>
         </div>
      );
   }

   if (workflow.steps.length === 0) {
      return (
         <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
            <h2 className="text-xl font-semibold">
               Dieser Workflow enthält noch keine Schritte.
            </h2>
            <Button asChild>
               <Link href={`/workflows/${workflow.id}/edit`}>Zum Editor</Link>
            </Button>
         </div>
      );
   }

   return (
      <div
         className="flex h-screen flex-col bg-background"
         data-testid="workflow-runner"
      >
         {/* Header */}
         <div className="flex items-center justify-between border-b bg-white px-6 py-3">
            <div className="flex items-center gap-3">
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  disabled={!canGoBack}
                  data-testid="runner-back-btn"
               >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Zurück
               </Button>
               <Separator orientation="vertical" className="h-5" />
               <h1 className="font-semibold text-slate-900">
                  {workflow.title}
               </h1>
            </div>
            <Button
               variant="ghost"
               size="sm"
               asChild
               data-testid="runner-close-btn"
            >
               <Link href="/workflows">
                  <X className="mr-1 h-4 w-4" />
                  Beenden
               </Link>
            </Button>
         </div>

         {/* Breadcrumb path */}
         <div className="flex items-center gap-1 overflow-x-auto border-b bg-slate-50 px-6 py-2 text-sm">
            {state.historyStack
               .slice(0, state.currentIndex + 1)
               .map((stepId, idx) => {
                  const step = workflow.steps.find((s) => s.id === stepId);
                  const isCurrent = idx === state.currentIndex;
                  return (
                     <span key={stepId} className="flex items-center gap-1">
                        {idx > 0 && (
                           <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        )}
                        <span
                           className={
                              isCurrent
                                 ? "font-semibold text-primary"
                                 : "text-muted-foreground"
                           }
                        >
                           {step?.title ?? stepId}
                        </span>
                     </span>
                  );
               })}
         </div>

         {/* Content */}
         <div className="flex-1 overflow-y-auto p-6">
            {currentStep ? (
               <StepRenderer
                  step={currentStep}
                  templateData={templateDataCache[currentStep.id] ?? null}
               />
            ) : (
               <p className="text-muted-foreground">Schritt nicht gefunden.</p>
            )}
         </div>

         {/* Navigation footer */}
         <div className="border-t bg-white px-6 py-4">
            {isCompleted ? (
               <CompletedState onRestart={handleRestart} />
            ) : (
               <NextStepButtons
                  edges={outgoingEdges}
                  steps={workflow.steps}
                  onChoose={handleChooseEdge}
               />
            )}
         </div>
      </div>
   );
};

// ── Sub-components ────────────────────────────────────────────────────────────

type StepRendererProps = {
   step: DWorkflowStep;
   templateData: DPromptGenerationData | null;
};

const StepRenderer = ({ step, templateData }: StepRendererProps) => {
   return (
      <div className="mx-auto max-w-3xl space-y-4">
         <h2 className="text-xl font-bold text-slate-900">{step.title}</h2>

         {/* Hinweis-Box */}
         {step.hint && (
            <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
               <Info className="mt-0.5 h-4 w-4 shrink-0" />
               <span>{step.hint}</span>
            </div>
         )}

         {/* PROMPT_REF */}
         {step.type === "PROMPT_REF" && (
            <>
               {templateData ? (
                  <UsePromptForm
                     templateData={templateData}
                     recommendedModel={templateData.template.recommendedModel}
                  />
               ) : (
                  <div className="flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                     <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                     Das verknüpfte Template wurde gelöscht. Dieser Schritt kann
                     nicht ausgeführt werden.
                  </div>
               )}
            </>
         )}

         {/* STANDALONE */}
         {step.type === "STANDALONE" && step.content && (
            <div>
               <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                     Prompt-Text
                  </span>
                  <CopyButton
                     content={step.content}
                     variant="ghost"
                     size="sm"
                     showLabel
                  />
               </div>
               <div className="rounded-lg bg-slate-100 p-5">
                  <MDRenderer className="font-mono text-sm leading-relaxed text-slate-900">
                     {step.content}
                  </MDRenderer>
               </div>
            </div>
         )}
      </div>
   );
};

type NextStepButtonsProps = {
   edges: DWorkflowStep["outgoingEdges"];
   steps: DWorkflowStep[];
   onChoose: (toStepId: string) => void;
};

const NextStepButtons = ({ edges, steps, onChoose }: NextStepButtonsProps) => {
   if (edges.length === 0) return null;

   return (
      <div className="space-y-3">
         <p className="text-sm font-medium text-slate-700">
            Wie möchtest du weiter?
         </p>
         <div className="flex flex-wrap gap-3">
            {edges
               .sort((a, b) => a.order - b.order)
               .map((edge) => {
                  const target = steps.find((s) => s.id === edge.toStepId);
                  return (
                     <Button
                        key={edge.id}
                        variant="outline"
                        onClick={() => onChoose(edge.toStepId)}
                        data-testid={`edge-btn-${edge.id}`}
                     >
                        {edge.label}
                        {target && (
                           <Badge variant="secondary" className="ml-2 text-xs">
                              {target.title}
                           </Badge>
                        )}
                     </Button>
                  );
               })}
         </div>
      </div>
   );
};

type CompletedStateProps = {
   onRestart: () => void;
};

const CompletedState = ({ onRestart }: CompletedStateProps) => (
   <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-green-700">
         <span className="text-lg">✓</span>
         <span className="font-semibold">Workflow abgeschlossen</span>
      </div>
      <div className="flex gap-3">
         <Button
            variant="outline"
            onClick={onRestart}
            data-testid="restart-btn"
         >
            Von vorne starten
         </Button>
         <Button asChild data-testid="close-btn">
            <Link href="/workflows">Schliessen</Link>
         </Button>
      </div>
   </div>
);
