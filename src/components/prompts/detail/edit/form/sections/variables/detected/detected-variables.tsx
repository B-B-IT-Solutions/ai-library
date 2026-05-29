"use client";

import { includes, isEmpty, map } from "es-toolkit/compat";
import { AlertCircle, CheckCircle2, Plus, PlusCircle } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { CallbackFn } from "@/data/types/common";
import { VariableStatus } from "../../../utils/variables";

type Props = {
   detectedVariables: string[];
   variableStatus: VariableStatus;
   onAddVariable: (variableName: string) => void;
   onSyncAll: CallbackFn;
};

export const DetectedVariables = ({
   detectedVariables,
   variableStatus,
   onAddVariable,
   onSyncAll,
}: Props) => {
   if (isEmpty(detectedVariables)) {
      return null;
   }

   const hasUndefinedVariables = !isEmpty(variableStatus.undefined);
   const undefinedCount = variableStatus.undefined.length;

   const renderVariable = (varName: string) => {
      const isDefined = !includes(variableStatus.undefined, varName);
      return (
         <div
            key={varName}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 ${
               isDefined
                  ? "border-green-200 bg-green-50 text-green-900"
                  : "border-orange-200 bg-orange-50 text-orange-900"
            }`}
            data-testid="detected-variable"
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
                  className="ml-2 h-6 cursor-pointer px-2 text-xs hover:bg-orange-100"
                  data-testid="add-btn"
               >
                  <Plus className="mr-1 h-3 w-3" />
                  Hinzufügen
               </Button>
            )}
         </div>
      );
   };

   return (
      <section className="space-y-2" data-testid="detected-variables">
         <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Erkannte Platzhalter
         </p>
         <p className="text-sm text-slate-500">
            Platzhalter, die im Prompt erkannt wurden
         </p>
         <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            {hasUndefinedVariables && (
               <div
                  className="mb-3 flex items-center justify-between rounded-md bg-orange-100 px-3 py-1 text-sm text-orange-800"
                  data-testid="undefined-variables"
               >
                  <div className="flex items-center gap-2">
                     <AlertCircle className="h-4 w-4" />
                     <span>
                        {undefinedCount} Platzhalter noch nicht konfiguriert
                     </span>
                  </div>
                  <Button
                     type="button"
                     onClick={onSyncAll}
                     variant="ghost"
                     size="sm"
                     className="cursor-pointer text-orange-800 hover:bg-orange-100 hover:text-orange-900"
                     data-testid="sync-all-btn"
                  >
                     <PlusCircle className="mr-1 h-3 w-3" />
                     Alle hinzufügen
                  </Button>
               </div>
            )}
            <div className="flex flex-wrap gap-2">
               {map(detectedVariables, renderVariable)}
            </div>
         </div>
      </section>
   );
};
