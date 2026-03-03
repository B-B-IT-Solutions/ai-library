"use client";

import { Control, UseFormWatch } from "react-hook-form";

import {
   TemplateFieldDefaultValue,
   TemplateFieldDescription,
   TemplateFieldLabel,
   TemplateFieldName,
   TemplateFieldRequired,
   TemplateFieldSelectOptions,
   TemplateFieldType,
} from "@/components/shared/template-fields";
import { FormSelect } from "@/components/shared/widgets";
import { DPromptTemplateFieldType } from "@/data/types/domain/prompt.template";
import { DGlobalTemplateFieldUpdate } from "@/data/types/domain/settings";

type Props = {
   watch: UseFormWatch<DGlobalTemplateFieldUpdate>;
   control: Control<DGlobalTemplateFieldUpdate>;
};

const OPTION_TYPES: DPromptTemplateFieldType[] = ["SELECT", "RADIO"];

export const GlobalTemplateFieldForm = ({ watch, control }: Props) => {
   const type = watch("type");
   const options = watch("options") ?? [];

   const renderDefaultValue = () => {
      if (OPTION_TYPES.includes(type)) {
         return (
            <FormSelect<DGlobalTemplateFieldUpdate>
               name="defaultValue"
               label="Standardwert"
               placeholder="Standardwert auswählen"
               options={options}
               control={control}
            />
         );
      }
      return (
         <TemplateFieldDefaultValue<DGlobalTemplateFieldUpdate>
            name="defaultValue"
            control={control}
         />
      );
   };

   const renderSelectedOptions = () => {
      if (OPTION_TYPES.includes(type)) {
         return (
            <TemplateFieldSelectOptions<DGlobalTemplateFieldUpdate>
               name="options"
               control={control}
            />
         );
      }
   };

   return (
      <div className="grid grid-cols-2 gap-4" data-testid="template-field-form">
         <TemplateFieldName<DGlobalTemplateFieldUpdate>
            name={"name"}
            control={control}
            watch={watch}
         />
         <TemplateFieldLabel<DGlobalTemplateFieldUpdate>
            name={"label"}
            control={control}
         />
         <TemplateFieldType<DGlobalTemplateFieldUpdate>
            name={"type"}
            control={control}
         />
         {renderDefaultValue()}
         {renderSelectedOptions()}
         <TemplateFieldDescription<DGlobalTemplateFieldUpdate>
            name="description"
            control={control}
         />
         <TemplateFieldRequired<DGlobalTemplateFieldUpdate>
            name="required"
            control={control}
         />
      </div>
   );
};
