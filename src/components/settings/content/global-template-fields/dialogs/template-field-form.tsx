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
import { DGlobalPromptFieldUpdate } from "@/data/types/domain/settings";

type Props = {
   watch: UseFormWatch<DGlobalPromptFieldUpdate>;
   control: Control<DGlobalPromptFieldUpdate>;
};

export const GlobalPromptFieldForm = ({ watch, control }: Props) => {
   const type = watch("type");
   const options = watch("options") ?? [];

   return (
      <div className="grid grid-cols-2 gap-4" data-testid="template-field-form">
         <TemplateFieldName<DGlobalPromptFieldUpdate>
            name={"name"}
            control={control}
            watch={watch}
         />
         <TemplateFieldLabel<DGlobalPromptFieldUpdate>
            name={"label"}
            control={control}
         />
         <TemplateFieldType<DGlobalPromptFieldUpdate>
            name={"type"}
            control={control}
         />
         <TemplateFieldDefaultValue<DGlobalPromptFieldUpdate>
            name="defaultValue"
            control={control}
            type={type}
            options={options}
         />
         <TemplateFieldSelectOptions<DGlobalPromptFieldUpdate>
            name="options"
            type={type}
            control={control}
         />
         <TemplateFieldDescription<DGlobalPromptFieldUpdate>
            name="description"
            control={control}
         />
         <TemplateFieldRequired<DGlobalPromptFieldUpdate>
            name="required"
            control={control}
         />
      </div>
   );
};
