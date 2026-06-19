"use client";

import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/shadcn/button";

type Props = {
   onRestart: () => void;
   stepCount: number;
};

export const CompletedState = ({ onRestart, stepCount }: Props) => (
   <div className="flex flex-wrap items-center justify-end gap-4">
      <div className="flex items-center gap-3">
         <CheckCircle2 className="h-5 w-5 animate-in text-green-600 duration-300 zoom-in-50" />
         <div>
            <span className="font-semibold text-foreground">
               Workflow abgeschlossen
            </span>
            <p className="mt-0.5 text-xs text-muted-foreground">
               {stepCount} {stepCount === 1 ? "Schritt" : "Schritte"}{" "}
               durchlaufen
            </p>
         </div>
      </div>
      <div className="flex gap-3">
         <Button variant="ghost" onClick={onRestart} data-testid="restart-btn">
            Von vorne starten
         </Button>
      </div>
   </div>
);
