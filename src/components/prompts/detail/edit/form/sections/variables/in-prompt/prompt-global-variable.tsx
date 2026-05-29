"use client";

import { Trash2 } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { getPromptVariableTypeLabel } from "@/components/shared/template-fields";
import { DGlobalPromptField } from "@/data/types/domain/settings";

import { StatusBadge } from "./status-badge";

type Props = {
   field: DGlobalPromptField;
   isUsed: boolean;
   onRemoveGlobalFieldId: (id: string) => void;
};

export const PromptGlobalVariable = ({
   field,
   isUsed,
   onRemoveGlobalFieldId,
}: Props) => {
   return (
      <div
         key={field.id}
         className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
            isUsed
               ? "border-green-200 bg-green-50"
               : "border-orange-200 bg-orange-50"
         }`}
         data-testid="prompt-global-variable"
      >
         <div className="grid flex-1 grid-cols-[minmax(160px,1fr)_100px_60px_160px] items-center gap-3">
            <div className="min-w-0 truncate">
               <span className="text-sm font-medium text-slate-900">
                  {field.label}
               </span>
               <code className="ml-2 font-mono text-xs text-slate-500">
                  {`{{${field.name}}}`}
               </code>
            </div>
            <Badge variant="secondary" className="text-xs">
               {getPromptVariableTypeLabel(field.type)}
            </Badge>
            <div>
               {field.required && (
                  <Badge variant="outline" className="text-xs">
                     Pflicht
                  </Badge>
               )}
            </div>
            <div className="mx-auto">
               <StatusBadge hasName={true} isUsed={isUsed} />
            </div>
         </div>
         <Button
            type="button"
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={() => onRemoveGlobalFieldId(field.id)}
            data-testid="remove-global-field-btn"
         >
            <Trash2 className="h-4 w-4" />
         </Button>
      </div>
   );
};
