"use client";

import { FC } from "react";
import { Plus } from "lucide-react";
import { Control, UseFormWatch } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import { TemplateFieldItem } from "../field/template-field-item";

type FieldType = {
   id: string;
   name: string;
   label: string;
   description?: string;
   type: string;
   required: boolean;
   order: number;
   defaultValue?: string;
   options?: string[];
};

type FormData = {
   fields: FieldType[];
};

type Props = {
   control: Control<FormData>;
   watch: UseFormWatch<FormData>;
   fields: FieldType[];
   detectedVariables: string[];
   onAddField: () => void;
   onRemoveField: (index: number) => void;
};

export const TemplateFieldsSection: FC<Props> = ({
   control,
   watch,
   fields,
   detectedVariables,
   onAddField,
   onRemoveField,
}) => {
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

         {fields.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
               <p className="text-slate-500">Noch keine Felder hinzugefügt</p>
               <p className="mt-1 text-sm text-slate-400">
                  Klicken Sie auf &quot;Feld hinzufügen&quot;, um zu beginnen
               </p>
            </div>
         )}

         <div className="space-y-4">
            {fields.map((field, index) => {
               const fieldName = watch(`fields.${index}.name`);
               const isUsedInContent = detectedVariables.includes(fieldName);
               const hasName = fieldName && fieldName.trim() !== "";

               return (
                  <TemplateFieldItem
                     key={field.id}
                     control={control}
                     index={index}
                     fieldName={fieldName}
                     isUsedInContent={isUsedInContent}
                     hasName={hasName}
                     onRemove={() => onRemoveField(index)}
                  />
               );
            })}
         </div>
      </section>
   );
};
