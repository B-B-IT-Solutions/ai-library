"use client";

import { useEffect } from "react";

interface AnalysisLoaderProps {
   onDone: () => void;
}

export const AnalysisLoader = ({ onDone }: AnalysisLoaderProps) => {
   useEffect(() => {
      const timer = setTimeout(onDone, 1500);
      return () => clearTimeout(timer);
   }, [onDone]);

   return (
      <div
         className="flex flex-col items-center py-12 text-center"
         data-testid="analysis-loader"
      >
         <div className="mb-6 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
         <h2 className="mb-2 text-xl font-semibold text-slate-800">
            Wird analysiert …
         </h2>
         <p className="text-sm text-slate-500">
            Wir werten deine Antworten aus und berechnen dein persönliches
            Ergebnis.
         </p>
      </div>
   );
};
