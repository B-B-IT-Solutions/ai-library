"use client";

import { FC } from "react";
import { includes, isEmpty, map } from "es-toolkit/compat";
import {
   AlertCircle,
   CheckCircle2,
   Plus,
   RefreshCw,
   Sparkles,
} from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { CallbackFn } from "@/data/types/common";
import { VariableStatus } from "../utils/variables";

type Props = {
   detectedVariables: string[];
   variableStatus: VariableStatus;
   onAddVariable: (variableName: string) => void;
   onSyncAll: CallbackFn;
};

export const DetectedVariables: FC<Props> = ({
   detectedVariables,
   variableStatus,
   onAddVariable,
   onSyncAll,
}) => {
   if (isEmpty(detectedVariables)) {
      return null;
   }

   const hasUndefinedVariables = !isEmpty(variableStatus.undefined);

   const header = () => {
      return (
         <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
               <Sparkles className="h-5 w-5 text-indigo-600" />
               Erkannte Variablen
            </h3>
            <p className="mt-1 text-sm text-slate-500">
               Variablen, die in Ihrer Prompt-Vorlage gefunden wurden
            </p>
         </div>
      );
   };

   const renderDetectedVariable = (varName: string) => {
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

   const renderDetectedVariables = () => {
      return (
         <div className="flex flex-wrap gap-2">
            {map(detectedVariables, (varName) =>
               renderDetectedVariable(varName)
            )}
         </div>
      );
   };

   const renderUndefinedVariables = () => {
      if (hasUndefinedVariables) {
         return (
            <div
               className="mt-3 rounded-md bg-orange-100 p-3 text-sm text-orange-800"
               data-testid="undefined-variables"
            >
               <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                     {variableStatus.undefined.length} Variable(n) noch nicht
                     als Feld definiert
                  </span>
               </div>
            </div>
         );
      }
   };

   return (
      <section className="space-y-4" data-testid="detected-variables">
         {header()}
         <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
               <div className="text-sm text-slate-700">
                  <span className="font-medium">
                     {detectedVariables.length}
                  </span>{" "}
                  Variable(n) im Content gefunden
               </div>
               {hasUndefinedVariables && (
                  <Button
                     type="button"
                     onClick={onSyncAll}
                     variant="outline"
                     size="sm"
                     className="cursor-pointer"
                     data-testid="sync-all-btn"
                  >
                     <RefreshCw className="mr-2 h-3 w-3" />
                     Alle synchronisieren
                  </Button>
               )}
            </div>
            {renderDetectedVariables()}
            {renderUndefinedVariables()}
         </div>
      </section>
   );
};
