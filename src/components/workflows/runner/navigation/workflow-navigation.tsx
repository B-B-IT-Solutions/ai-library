"use client";

import { sortBy } from "es-toolkit";
import { map } from "es-toolkit/compat";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { DWorkflowStep, DWorkflowStepEdge } from "@/data/types/domain/workflow";

import { NextStep } from "./workflow-step";

type Props = {
   edges: DWorkflowStepEdge[];
   allSteps: DWorkflowStep[];
   onNextStep: (toStepEdgeId: string) => void;
   onPreviousStep: () => void;
   previousEnabled: boolean;
};

export const WorkflowNavigation = ({
   edges,
   allSteps,
   onNextStep,
   onPreviousStep,
   previousEnabled,
}: Props) => {
   const sortedEdges = sortBy(edges, [(a) => a.order]);

   const nextStep = (edge: DWorkflowStepEdge, index: number) => {
      return (
         <NextStep
            key={index}
            edge={edge}
            allSteps={allSteps}
            onSelected={onNextStep}
         />
      );
   };

   return (
      <div
         className="flex items-start justify-end gap-4"
         data-testid="workflow-navigation"
      >
         <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousStep}
            disabled={!previousEnabled}
            className="shrink-0 cursor-pointer"
            data-testid="previous-step-btn"
         >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Zurück
         </Button>

         <div className="flex flex-col gap-2" data-tesiid="next-steps">
            {map(sortedEdges, (edge, idx) => nextStep(edge, idx))}
         </div>
      </div>
   );
};
