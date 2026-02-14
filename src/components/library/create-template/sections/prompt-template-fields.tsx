"use client";

import { FC } from "react";
import { isEmpty, map } from "es-toolkit/compat";
import { Plus } from "lucide-react";
import { Control, UseFormWatch } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import { CallbackFn } from "@/data/types/common";
import {
   DPromptTemplateField,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";

import { PromptTemplateField } from "./prompt-template-field";

type Props = {
   fields: DPromptTemplateField[];
   detectedVariables: string[];
   onAddField: CallbackFn;
   onRemoveField: (index: number) => void;
   control: Control<DPromptTemplateUpdate>;
   watch: UseFormWatch<DPromptTemplateUpdate>;
};

export const PromptTemplateFields: FC<Props> = ({
   fields,
   detectedVariables,
   onAddField,
   onRemoveField,
   control,
   watch,
}) => {
   const header = () => {
      return (
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
               className="cursor-pointer"
               data-testid="add-btn"
            >
               <Plus className="mr-2 h-4 w-4" />
               Feld hinzufügen
            </Button>
         </div>
      );
   };

   const renderField = (field: DPromptTemplateField, idx: number) => {
      const fieldName = watch(`fields.${idx}.name`);
      const isUsed = detectedVariables.includes(fieldName);
      const hasName = fieldName && fieldName.trim() !== "";

      return (
         <PromptTemplateField
            key={field.id}
            index={idx}
            isUsed={isUsed}
            hasName={hasName}
            onRemove={() => onRemoveField(idx)}
            control={control}
            watch={watch}
         />
      );
   };

   const renderFields = () => {
      if (isEmpty(fields)) {
         return (
            <div
               className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center"
               data-testid="fields-empty"
            >
               <p className="text-slate-500">Noch keine Felder hinzugefügt</p>
               <p className="mt-1 text-sm text-slate-400">
                  Klicken Sie auf &quot;Feld hinzufügen&quot;, um zu beginnen
               </p>
            </div>
         );
      }
      return (
         <div className="space-y-4" data-testid="fields">
            {map(fields, (field, idx) => renderField(field, idx))}
         </div>
      );
   };

   return (
      <section className="space-y-4" data-testid="prompt-template-fields">
         {header()}
         {renderFields()}
      </section>
   );
};
