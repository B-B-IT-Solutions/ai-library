"use client";

import { Button } from "@/components/shadcn/button";

type Props = {
   onRestart: () => void;
   onClose?: () => void;
};

export const CompletedState = ({ onRestart, onClose }: Props) => (
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
         <Button onClick={onClose} data-testid="close-btn">
            Schliessen
         </Button>
      </div>
   </div>
);
