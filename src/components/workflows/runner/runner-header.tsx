"use client";

import { ArrowLeft, X } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";

type Props = {
   title: string;
   canGoBack: boolean;
   onBack: () => void;
   onClose?: () => void;
};

export const RunnerHeader = ({ title, canGoBack, onBack, onClose }: Props) => {
   return (
      <div className="flex items-center justify-between border-b bg-background px-6 py-3">
         <div className="flex items-center gap-3">
            <Button
               variant="ghost"
               size="sm"
               onClick={onBack}
               disabled={!canGoBack}
               data-testid="runner-back-btn"
            >
               <ArrowLeft className="mr-1 h-4 w-4" />
               Zurück
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <h1 className="font-semibold text-foreground">{title}</h1>
         </div>
         <Button
            variant={canGoBack ? "outline" : "ghost"}
            size="sm"
            onClick={onClose}
            data-testid="runner-close-btn"
         >
            <X className="mr-1 h-4 w-4" />
         </Button>
      </div>
   );
};
