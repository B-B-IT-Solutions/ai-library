"use client";

import { FC } from "react";
import { filter, includes, isEmpty, map } from "es-toolkit/compat";
import { debounce, useQueryState } from "nuqs";

import { Badge } from "@/components/shadcn/badge";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";
import { useLoadLibraryModels } from "@/data/ts-queries/library";
import { librarySearchParams } from "../search-params";

export const ModelsFilter: FC = () => {
   const [f_models, setModels] = useQueryState(
      "f_models",
      librarySearchParams["f_models"]
   );

   const { data: models = [], isLoading } = useLoadLibraryModels();

   const toggleModel = (model: string) => {
      const isSelected = includes(f_models, model);
      const newModels = isSelected
         ? filter(f_models, (m) => m !== model)
         : [...f_models, model];

      setModels(newModels, {
         limitUrlUpdates: debounce(400),
      });
   };

   const badge = () => {
      if (!isEmpty(f_models)) {
         return (
            <Badge variant="secondary" className="h-5 px-2 text-xs">
               {f_models.length}
            </Badge>
         );
      }
   };

   const renderModel = (model: string) => {
      const isSelected = includes(f_models, model);
      return (
         <div key={model} className="flex items-center space-x-2">
            <Checkbox
               id={`model-${model}`}
               checked={isSelected}
               onCheckedChange={() => toggleModel(model)}
               data-testid={`model-${model}`}
            />
            <Label
               htmlFor={`model-${model}`}
               className="cursor-pointer text-sm font-normal"
            >
               {model}
            </Label>
         </div>
      );
   };

   if (isLoading) {
      return <div className="text-sm text-slate-500">Lädt...</div>;
   }

   if (isEmpty(models)) {
      return (
         <div className="text-sm text-slate-500" data-testid="models-empty">
            Keine Modelle verfügbar
         </div>
      );
   }

   return (
      <div className="space-y-3" data-testid="models-filter">
         <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Modelle</Label>
            {badge()}
         </div>
         <div className="max-h-[200px] space-y-2 overflow-y-auto">
            {map(models, renderModel)}
         </div>
      </div>
   );
};
