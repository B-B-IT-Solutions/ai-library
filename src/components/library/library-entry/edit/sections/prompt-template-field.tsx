"use client";

import { FC } from "react";
import { AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { Control, UseFormWatch } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   TemplateFieldDefaultValue,
   TemplateFieldDescription,
   TemplateFieldLabel,
   TemplateFieldName,
   TemplateFieldRequired,
   TemplateFieldType,
} from "@/components/shared/global-template-fields";
import { CallbackFn } from "@/data/types/common";
import { DPromptTemplateUpdate } from "@/data/types/domain/prompt.template";

type Props = {
   index: number;
   isUsed: boolean;
   hasName: boolean;
   onRemove: CallbackFn;
   control: Control<DPromptTemplateUpdate>;
   watch: UseFormWatch<DPromptTemplateUpdate>;
};

export const PromptTemplateField: FC<Props> = ({
   index,
   isUsed,
   hasName,
   onRemove,
   control,
   watch,
}) => {
   const header = () => {
      return (
         <div
            className="mb-4 flex items-center justify-between"
            data-testid="header"
         >
            <div className="flex items-center gap-2">
               <h4 className="font-medium text-slate-900">Feld {index + 1}</h4>
               {hasName && isUsed && (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                     <CheckCircle2 className="h-3 w-3" />
                     Im Content verwendet
                  </span>
               )}
               {hasName && !isUsed && (
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
               className="cursor-pointer"
               data-testid="remove-btn"
            >
               <Trash2 className="h-4 w-4" />
            </Button>
         </div>
      );
   };

   const formInputs = () => {
      return (
         <div className="grid grid-cols-2 gap-4">
            <TemplateFieldName<DPromptTemplateUpdate>
               name={`fields.${index}.name`}
               control={control}
               watch={watch}
            />
            <TemplateFieldLabel<DPromptTemplateUpdate>
               name={`fields.${index}.label`}
               control={control}
            />
            <TemplateFieldType<DPromptTemplateUpdate>
               name={`fields.${index}.type`}
               control={control}
            />
            <TemplateFieldDefaultValue<DPromptTemplateUpdate>
               name={`fields.${index}.defaultValue`}
               control={control}
            />
            <TemplateFieldDescription<DPromptTemplateUpdate>
               name={`fields.${index}.description`}
               control={control}
            />
            <TemplateFieldRequired<DPromptTemplateUpdate>
               name={`fields.${index}.required`}
               control={control}
            />
         </div>
      );
   };

   return (
      <div
         className={`rounded-lg border p-6 ${
            hasName && !isUsed
               ? "border-orange-200 bg-orange-50"
               : hasName && isUsed
                 ? "border-green-200 bg-green-50"
                 : "border-slate-200 bg-slate-50"
         }`}
         data-testid="prompt-template-field"
      >
         {header()}
         {formInputs()}
      </div>
   );
};
