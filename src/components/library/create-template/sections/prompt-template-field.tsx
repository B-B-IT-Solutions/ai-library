"use client";

import { FC } from "react";
import { AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { Control, UseFormGetValues } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   FormCheckBox,
   FormInput,
   FormSelect,
   FormTextArea,
} from "@/components/shared/widgets";
import { DPromptTemplateUpdate } from "@/data/types/domain/prompt.template";

const FIELD_TYPES = [
   { value: "TEXT", label: "Text" },
   { value: "TEXTAREA", label: "Textarea" },
   { value: "EMAIL", label: "E-Mail" },
   { value: "NUMBER", label: "Nummer" },
   { value: "DATE", label: "Datum" },
   { value: "SELECT", label: "Auswahl" },
   { value: "CHECKBOX", label: "Checkbox" },
   { value: "RADIO", label: "Radio" },
];

type Props = {
   index: number;
   isUsedInContent: boolean;
   hasName: boolean;
   onRemove: () => void;
   control: Control<DPromptTemplateUpdate>;
   getValues: UseFormGetValues<DPromptTemplateUpdate>;
};

export const PromptTemplateField: FC<Props> = ({
   index,
   isUsedInContent,
   hasName,
   onRemove,
   control,
   getValues,
}) => {
   const getValue = (name: string) => {
      return getValues(name);
   };

   const header = () => {
      return (
         <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <h4 className="font-medium text-slate-900">Feld {index + 1}</h4>
               {hasName && isUsedInContent && (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                     <CheckCircle2 className="h-3 w-3" />
                     Im Content verwendet
                  </span>
               )}
               {hasName && !isUsedInContent && (
                  <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800">
                     <AlertCircle className="h-3 w-3" />
                     Nicht verwendet
                  </span>
               )}
            </div>
            <Button
               type="button"
               onClick={onRemove}
               variant="ghost"
               size="sm"
               data-testid="remove-btn"
            >
               <Trash2 className="h-4 w-4" />
            </Button>
         </div>
      );
   };

   const name = () => {
      const fieldName = `fields.${index}.name`;
      const value = getValue(`fields.${index}.name`) || "feldname";
      return (
         <FormInput
            name={fieldName}
            label="Feldname"
            placeholder="z.B. thema"
            message={`Verwenden Sie diesen Namen als {{${value}}}`}
            control={control}
         />
      );
   };

   const label = () => {
      const name = `fields.${index}.label`;
      return (
         <FormInput
            name={name}
            label="Label"
            placeholder="z.B. Thema"
            control={control}
         />
      );
   };

   const type = () => {
      const name = `fields.${index}.type`;
      return (
         <FormSelect
            name={name}
            label="Feldtyp"
            options={FIELD_TYPES}
            control={control}
         />
      );
   };

   const defaultValue = () => {
      const name = `fields.${index}.defaultValue`;
      return (
         <FormInput
            name={name}
            label="Standardwert"
            placeholder="Standardwert des Feldes"
            control={control}
         />
      );
   };

   const description = () => {
      const name = `fields.${index}.description`;
      return (
         <FormTextArea
            name={name}
            label="Beschreibung"
            placeholder="Beschreibung des Feldes"
            rows={2}
            className="col-span-2"
            control={control}
         />
      );
   };

   const required = () => {
      const name = `fields.${index}.required`;
      return (
         <FormCheckBox
            name={name}
            label="Dieses Feld ist erforderlich"
            className="col-span-2"
            control={control}
         />
      );
   };

   const fields = () => {
      return (
         <div className="grid grid-cols-2 gap-4">
            {name()}
            {label()}
            {type()}
            {defaultValue()}
            {description()}
            {required()}
         </div>
      );
   };

   return (
      <div
         className={`rounded-lg border p-6 ${
            hasName && !isUsedInContent
               ? "border-orange-200 bg-orange-50"
               : hasName && isUsedInContent
                 ? "border-green-200 bg-green-50"
                 : "border-slate-200 bg-slate-50"
         }`}
      >
         {header()}
         {fields()}
      </div>
   );
};
