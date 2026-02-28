"use client";

import { FC } from "react";
import { filter, isEmpty, map } from "es-toolkit/compat";
import { AlertCircle, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Control, UseFormWatch } from "react-hook-form";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { CallbackFn } from "@/data/types/common";
import {
   DPromptTemplateField,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";
import { DGlobalTemplateField } from "@/data/types/domain/settings";

import { GlobalFieldsPicker } from "./global-fields-picker";
import { PromptTemplateField } from "./prompt-template-field";

type Props = {
   fields: DPromptTemplateField[];
   detectedVariables: string[];
   globalFields?: DGlobalTemplateField[];
   globalFieldIds?: string[];
   onAddField: CallbackFn;
   onAddGlobalFieldIds?: (ids: string[]) => void;
   onRemoveGlobalFieldId?: (id: string) => void;
   onRemoveField: (index: number) => void;
   control: Control<DPromptTemplateUpdate>;
   watch: UseFormWatch<DPromptTemplateUpdate>;
};

export const PromptTemplateFields: FC<Props> = ({
   fields,
   detectedVariables,
   globalFields = [],
   globalFieldIds = [],
   onAddField,
   onAddGlobalFieldIds,
   onRemoveGlobalFieldId,
   onRemoveField,
   control,
   watch,
}) => {
   const resolvedGlobalFields = filter(globalFields, (f) =>
      globalFieldIds.includes(f.id)
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
               {globalFields.length > 0 && onAddGlobalFieldIds && (
                  <GlobalFieldsPicker
                     globalFields={globalFields}
                     selectedGlobalFieldIds={globalFieldIds}
                     onAddFields={onAddGlobalFieldIds}
                  />
               )}
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
         </div>
      );
   };

   const renderGlobalFields = () => {
      if (isEmpty(resolvedGlobalFields)) return null;
      return (
         <div className="space-y-2" data-testid="global-fields">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
               Globale Felder
            </p>
            {map(resolvedGlobalFields, (field) => {
               const isUsed = detectedVariables.includes(field.name);
               return (
                  <div
                     key={field.id}
                     className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                        isUsed
                           ? "border-green-200 bg-green-50"
                           : "border-orange-200 bg-orange-50"
                     }`}
                     data-testid="global-field-reference"
                  >
                     <div className="flex items-center gap-3">
                        <div>
                           <span className="text-sm font-medium text-slate-900">
                              {field.label}
                           </span>
                           <code className="ml-2 font-mono text-xs text-slate-500">
                              {`{{${field.name}}}`}
                           </code>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                           {field.type}
                        </Badge>
                        {field.required && (
                           <Badge variant="outline" className="text-xs">
                              Pflicht
                           </Badge>
                        )}
                        {isUsed ? (
                           <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                              <CheckCircle2 className="h-3 w-3" />
                              Im Content verwendet
                           </span>
                        ) : (
                           <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800">
                              <AlertCircle className="h-3 w-3" />
                              Nicht verwendet
                           </span>
                        )}
                     </div>
                     {onRemoveGlobalFieldId && (
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
                     )}
                  </div>
               );
            })}
         </div>
      );
   };

   const renderField = (field: DPromptTemplateField, idx: number) => {
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
         {renderGlobalFields()}
         {renderFields()}
      </section>
   );
};
