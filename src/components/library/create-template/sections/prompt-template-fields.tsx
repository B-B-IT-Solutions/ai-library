"use client";

import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import { Plus } from "lucide-react";
import { Control, UseFormGetValues, UseFormWatch } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   DPromptTemplateField,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

import { PromptTemplateField } from "./prompt-template-field";

type Props = {
   control: Control<DPromptTemplateUpdate>;
   watch: UseFormWatch<DPromptTemplateUpdate>;
   getValues: UseFormGetValues<DPromptTemplateUpdate>;
   fields: DPromptTemplateField[];
   detectedVariables: string[];
   onAddField: () => void;
   onRemoveField: (index: number) => void;
};

export const PromptTemplateFields: FC<Props> = ({
   control,
   watch,
   getValues,
   fields,
   detectedVariables,
   onAddField,
   onRemoveField,
}) => {
   const renderField = (field: DPromptTemplateField, idx: number) => {
      const fieldName = watch(`fields.${idx}.name`);
      const isUsedInContent = detectedVariables.includes(fieldName);
      const hasName = fieldName && fieldName.trim() !== "";

      return (
         <PromptTemplateField
            key={field.id}
            control={control}
            getValues={getValues}
            index={idx}
            isUsed={isUsedInContent}
            hasName={hasName}
            onRemove={() => onRemoveField(idx)}
         />
      );
   };

   const renderFields = () => {
      return (
         <div className="space-y-4">
            {map(fields, (field, idx) => renderField(field, idx))}
         </div>
      );
   };

   return (
      <section className="space-y-4">
         <div className="flex items-center justify-between">
            <div>
               <h3 className="text-lg font-semibold text-slate-900">
                  Vorlagen-Felder
               </h3>
               <p className="mt-1 text-sm text-slate-500">
                  Definieren Sie Felder, die Benutzer ausfüllen können
               </p>
            </div>
            <Button
               type="button"
               onClick={onAddField}
               variant="outline"
               size="sm"
            >
               <Plus className="mr-2 h-4 w-4" />
               Feld hinzufügen
            </Button>
         </div>

         {isEmpty(fields) && (
            <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
               <p className="text-slate-500">Noch keine Felder hinzugefügt</p>
               <p className="mt-1 text-sm text-slate-400">
                  Klicken Sie auf &quot;Feld hinzufügen&quot;, um zu beginnen
               </p>
            </div>
         )}
         {renderFields()}
      </section>
   );
};
