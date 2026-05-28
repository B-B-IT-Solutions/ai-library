"use client";

import { useState } from "react";
import {
   AlertCircle,
   CheckCircle2,
   ChevronUp,
   Pencil,
   Trash2,
} from "lucide-react";
import { Control, useFormState, UseFormWatch } from "react-hook-form";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import {
   getPromptVariableTypeLabel,
   TemplateFieldDefaultValue,
   TemplateFieldDescription,
   TemplateFieldLabel,
   TemplateFieldName,
   TemplateFieldRequired,
   TemplateFieldSelectOptions,
   TemplateFieldType,
} from "@/components/shared/template-fields";
import { CallbackFn } from "@/data/types/common";
import { DPromptUpdate } from "@/data/types/domain/prompt";

type Props = {
   index: number;
   isUsed: boolean;
   hasName: boolean;
   onRemove: CallbackFn;
   control: Control<DPromptUpdate>;
   watch: UseFormWatch<DPromptUpdate>;
};

export const PromptVariable = ({
   index,
   isUsed,
   hasName,
   onRemove,
   control,
   watch,
}: Props) => {
   const type = watch(`fields.${index}.type`);
   const options = watch(`fields.${index}.options`) ?? [];
   const fieldName = watch(`fields.${index}.name`);
   const fieldLabel = watch(`fields.${index}.label`);
   const fieldRequired = watch(`fields.${index}.required`);
   const [isExpanded, setIsExpanded] = useState(false);

   const { errors } = useFormState({ control });
   const fieldErrors = errors.fields?.[index];
   const hasErrors = !!fieldErrors && Object.keys(fieldErrors).length > 0;

   const borderClass = hasErrors
      ? "border-2 border-red-400 bg-red-50"
      : hasName && !isUsed
        ? "border-orange-200 bg-orange-50"
        : hasName && isUsed
          ? "border-green-200 bg-green-50"
          : "border-slate-200 bg-slate-50";

   const statusBadge = () => {
      if (hasName) {
         if (isUsed) {
            return (
               <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Im Prompt verwendet
               </span>
            );
         }
         return (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800">
               <AlertCircle className="h-3 w-3" />
               Nicht verwendet
            </span>
         );
      }
   };

   const collapsedView = () => {
      return (
         <div
            className={`flex items-center justify-between rounded-lg border px-4 py-3 ${borderClass}`}
            data-testid="variable-collapsed"
         >
            <div className="grid flex-1 grid-cols-[minmax(160px,1fr)_100px_60px_160px] items-center gap-3">
               <div className="min-w-0 truncate">
                  <span className="text-sm font-medium text-slate-900">
                     {fieldLabel || `Platzhalter ${index + 1}`}
                  </span>
                  {fieldName && (
                     <code className="ml-2 font-mono text-xs text-slate-500">
                        {`{{${fieldName}}}`}
                     </code>
                  )}
               </div>
               <Badge variant="secondary" className="text-xs">
                  {getPromptVariableTypeLabel(type)}
               </Badge>
               <div>
                  {fieldRequired && (
                     <Badge variant="outline" className="text-xs">
                        Pflicht
                     </Badge>
                  )}
               </div>
               <div className="flex items-center gap-2">
                  {hasErrors && (
                     <Badge variant="destructive" className="gap-1 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        Fehler
                     </Badge>
                  )}
                  {statusBadge()}
               </div>
            </div>
            <div className="flex items-center">
               <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="shrink-0 cursor-pointer p-1"
                  data-testid="toggle-btn"
               >
                  <Pencil className="h-3.5 w-3.5 text-slate-500" />
               </Button>
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
         </div>
      );
   };

   const expandedView = () => {
      return (
         <div
            className={`rounded-lg border p-6 ${borderClass}`}
            data-testid="variable-expanded"
         >
            <div
               className="mb-4 flex items-center justify-between"
               data-testid="header"
            >
               <div className="flex min-w-0 items-center gap-2">
                  <h4 className="font-medium text-slate-900">
                     Platzhalter {index + 1}
                  </h4>
                  {fieldName && (
                     <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">
                        {`{{${fieldName}}}`}
                     </code>
                  )}
                  {statusBadge()}
               </div>
               <div className="flex items-center">
                  <Button
                     type="button"
                     variant="ghost"
                     size="sm"
                     onClick={() => setIsExpanded(false)}
                     className="shrink-0 cursor-pointer p-1"
                     data-testid="toggle-btn"
                  >
                     <ChevronUp className="h-3.5 w-3.5 text-slate-500" />
                  </Button>
                  <Button
                     type="button"
                     onClick={onRemove}
                     variant="ghost"
                     size="sm"
                     className="shrink-0 cursor-pointer"
                     data-testid="remove-btn"
                  >
                     <Trash2 className="h-4 w-4" />
                  </Button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <TemplateFieldName<DPromptUpdate>
                  name={`fields.${index}.name`}
                  control={control}
                  watch={watch}
               />
               <TemplateFieldLabel<DPromptUpdate>
                  name={`fields.${index}.label`}
                  control={control}
               />
               <TemplateFieldType<DPromptUpdate>
                  name={`fields.${index}.type`}
                  control={control}
               />
               <TemplateFieldDefaultValue<DPromptUpdate>
                  name={`fields.${index}.defaultValue`}
                  type={type}
                  options={options}
                  control={control}
               />
               <TemplateFieldSelectOptions<DPromptUpdate>
                  name={`fields.${index}.options`}
                  type={type}
                  control={control}
               />
               <TemplateFieldDescription<DPromptUpdate>
                  name={`fields.${index}.description`}
                  control={control}
               />
               <TemplateFieldRequired<DPromptUpdate>
                  name={`fields.${index}.required`}
                  control={control}
               />
            </div>
         </div>
      );
   };

   return (
      <div data-testid="prompt-variable">
         {isExpanded ? expandedView() : collapsedView()}
      </div>
   );
};
