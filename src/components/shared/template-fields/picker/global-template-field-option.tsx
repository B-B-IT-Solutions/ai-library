"use client";

import { Check } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { getTemplateFieldTypeLabel } from "@/components/shared/template-fields";
import { DGlobalTemplateField } from "@/data/types/domain/settings";

type Props = {
   field: DGlobalTemplateField;
   onToggle: (id: string, alreadyAdded: boolean) => void;
   alreadyAdded: boolean;
   isSelected: boolean;
};

export const GlobalTemplateFieldOption = ({
   field,
   onToggle,
   alreadyAdded,
   isSelected,
}: Props) => {
   return (
      <button
         type="button"
         onClick={() => onToggle(field.id, alreadyAdded)}
         disabled={alreadyAdded}
         className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${alreadyAdded ? "cursor-not-allowed bg-slate-50 opacity-50" : "cursor-pointer hover:bg-accent"} ${isSelected ? "bg-accent" : ""} `}
         data-testid="field-option"
      >
         <div className="flex min-w-0 items-center gap-2">
            {alreadyAdded ? (
               <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
            ) : (
               <div
                  className={`h-3.5 w-3.5 shrink-0 rounded border ${
                     isSelected
                        ? "border-primary bg-primary"
                        : "border-slate-300"
                  }`}
               >
                  {isSelected && (
                     <Check className="h-3 w-3 text-primary-foreground" />
                  )}
               </div>
            )}
            <span className="truncate font-medium">{field.label}</span>
            <code className="shrink-0 font-mono text-xs text-slate-500">
               {`{{${field.name}}}`}
            </code>
         </div>
         <Badge variant="secondary" className="ml-2 shrink-0 text-xs">
            {getTemplateFieldTypeLabel(field.type)}
         </Badge>
      </button>
   );
};
