"use client";

import { FC } from "react";
import {
   AlertCircle,
   CheckCircle2,
   Plus,
   RefreshCw,
   Sparkles,
} from "lucide-react";

import { Button } from "@/components/shadcn/button";

type VariableStatus = {
   undefined: string[];
   used: string[];
   unused: string[];
};

type Props = {
   detectedVariables: string[];
   variableStatus: VariableStatus;
   onAddVariable: (variableName: string) => void;
   onSyncAll: () => void;
};

export const DetectedVariables: FC<Props> = ({
   detectedVariables,
   variableStatus,
   onAddVariable,
   onSyncAll,
}) => {
   if (detectedVariables.length === 0) {
      return null;
   }

   return (
      <section className="space-y-4">
         <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
               <Sparkles className="h-5 w-5 text-indigo-600" />
               Erkannte Variablen
            </h3>
            <p className="mt-1 text-sm text-slate-500">
               Variablen, die in Ihrer Prompt-Vorlage gefunden wurden
            </p>
         </div>

         <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
               <div className="text-sm text-slate-700">
                  <span className="font-medium">
                     {detectedVariables.length}
                  </span>{" "}
                  Variable(n) im Content gefunden
               </div>
               {variableStatus.undefined.length > 0 && (
                  <Button
                     type="button"
                     onClick={onSyncAll}
                     variant="outline"
                     size="sm"
                  >
                     <RefreshCw className="mr-2 h-3 w-3" />
                     Alle synchronisieren
                  </Button>
               )}
            </div>

            <div className="flex flex-wrap gap-2">
               {detectedVariables.map((varName) => {
                  const isDefined = !variableStatus.undefined.includes(varName);
                  return (
                     <div
                        key={varName}
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 ${
                           isDefined
                              ? "border-green-200 bg-green-50 text-green-900"
                              : "border-orange-200 bg-orange-50 text-orange-900"
                        }`}
                     >
                        {isDefined ? (
                           <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                           <AlertCircle className="h-4 w-4 text-orange-600" />
                        )}
                        <code className="font-mono text-sm">{`{{${varName}}}`}</code>
                        {!isDefined && (
                           <Button
                              type="button"
                              onClick={() => onAddVariable(varName)}
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-6 px-2 text-xs"
                           >
                              <Plus className="mr-1 h-3 w-3" />
                              Hinzufügen
                           </Button>
                        )}
                     </div>
                  );
               })}
            </div>

            {variableStatus.undefined.length > 0 && (
               <div className="mt-3 rounded-md bg-orange-100 p-3 text-sm text-orange-800">
                  <div className="flex items-center gap-2">
                     <AlertCircle className="h-4 w-4" />
                     <span>
                        {variableStatus.undefined.length} Variable(n) noch nicht
                        als Feld definiert
                     </span>
                  </div>
               </div>
            )}
         </div>
      </section>
   );
};
