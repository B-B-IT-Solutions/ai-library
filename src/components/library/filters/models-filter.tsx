"use client";

import { FC } from "react";

import { Badge } from "@/components/shadcn/badge";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";
import { useLoadLibraryModels } from "@/data/ts-queries/library";

import { useLibraryFilters } from "./library-filters-context";

export const ModelsFilter: FC = () => {
   const context = useLibraryFilters();
   const { data: models = [], isLoading } = useLoadLibraryModels();

   const selectedModels = context.filters.models || [];

   const toggleModel = (model: string) => {
      const newModels = selectedModels.includes(model)
         ? selectedModels.filter((m) => m !== model)
         : [...selectedModels, model];

      context.setFilters({
         models: newModels.length > 0 ? newModels : undefined,
      });
   };

   if (isLoading) {
      return <div className="text-sm text-slate-500">Lädt...</div>;
   }

   if (models.length === 0) {
      return (
         <div className="text-sm text-slate-500">Keine Modelle verfügbar</div>
      );
   }

   return (
      <div className="space-y-3">
         <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Modelle</Label>
            {selectedModels.length > 0 && (
               <Badge variant="secondary" className="h-5 px-2 text-xs">
                  {selectedModels.length}
               </Badge>
            )}
         </div>
         <div className="max-h-[200px] space-y-2 overflow-y-auto">
            {models.map((model) => {
               const isSelected = selectedModels.includes(model);
               return (
                  <div key={model} className="flex items-center space-x-2">
                     <Checkbox
                        id={`model-${model}`}
                        checked={isSelected}
                        onCheckedChange={() => toggleModel(model)}
                     />
                     <Label
                        htmlFor={`model-${model}`}
                        className="cursor-pointer text-sm font-normal"
                     >
                        {model}
                     </Label>
                  </div>
               );
            })}
         </div>
      </div>
   );
};
