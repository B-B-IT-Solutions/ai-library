"use client";

import { FC } from "react";
import { filter, includes, isEmpty, map } from "es-toolkit/compat";
import { Plus } from "lucide-react";
import { Control, UseFormWatch } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import { GlobalTemplateFieldsPicker } from "@/components/shared/template-fields";
import { CallbackFn } from "@/data/types/common";
import {
   DPromptTemplateField,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";
import { DGlobalTemplateField } from "@/data/types/domain/settings";

import { PromptGlobalTemplateField } from "./prompt-global-template-field";
import { PromptTemplateField } from "./prompt-template-field";

type Props = {
   fields: DPromptTemplateField[];
   detectedVariables: string[];
   globalFields: DGlobalTemplateField[];
   globalFieldIds: string[];
   onAddField: CallbackFn;
   onRemoveField: (index: number) => void;
   onAddGlobalFieldIds: (ids: string[]) => void;
   onRemoveGlobalFieldId: (id: string) => void;
   control: Control<DPromptTemplateUpdate>;
   watch: UseFormWatch<DPromptTemplateUpdate>;
};

export const PromptTemplateFields: FC<Props> = ({
   fields,
   detectedVariables,
   globalFields,
   globalFieldIds,
   onAddField,
   onRemoveField,
   onAddGlobalFieldIds,
   onRemoveGlobalFieldId,
   control,
   watch,
}) => {
   const resolvedGlobalFields = filter(globalFields, (f) =>
      includes(globalFieldIds, f.id)
   );

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
            <div className="flex items-center gap-2">
               <Button
                  type="button"
                  onClick={onAddField}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  data-testid="add-btn"
               >
                  <Plus className="mr-1 h-4 w-4" />
                  Feld hinzufügen
               </Button>
               <GlobalTemplateFieldsPicker
                  globalFields={globalFields}
                  selectedGlobalFieldIds={globalFieldIds}
                  onAddFields={onAddGlobalFieldIds}
               />
            </div>
         </div>
      );
   };

   const renderGlobalField = (field: DGlobalTemplateField) => {
      const isUsed = includes(detectedVariables, field.name);
      return (
         <PromptGlobalTemplateField
            key={field.id}
            field={field}
            isUsed={isUsed}
            onRemoveGlobalFieldId={onRemoveGlobalFieldId}
         />
      );
   };

   const renderGlobalFields = () => {
      if (!isEmpty(resolvedGlobalFields)) {
         return (
            <div
               className="space-y-2"
               data-testid="prompt-global-template-fields"
            >
               <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                  Globale Felder
               </p>
               {map(resolvedGlobalFields, renderGlobalField)}
            </div>
         );
      }
   };

   const renderTemplateField = (field: DPromptTemplateField, idx: number) => {
      const fieldName = watch(`fields.${idx}.name`);
      const isUsed = detectedVariables.includes(fieldName);
      const hasName = !isEmpty(fieldName);

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

   const renderTemplateFields = () => {
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
            {map(fields, (field, idx) => renderTemplateField(field, idx))}
         </div>
      );
   };

   return (
      <section className="space-y-4" data-testid="prompt-template-fields">
         {header()}
         {renderGlobalFields()}
         {renderTemplateFields()}
      </section>
   );
};
