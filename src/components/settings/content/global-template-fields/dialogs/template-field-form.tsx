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
import { DGlobalTemplateFieldUpdate } from "@/data/types/domain/settings";

type Props = {
   watch: UseFormWatch<DGlobalTemplateFieldUpdate>;
   control: Control<DGlobalTemplateFieldUpdate>;
};

const OPTION_TYPES = ["SELECT", "RADIO"];

export const GlobalTemplateFieldForm = ({ watch, control }: Props) => {
   const type = watch("type");

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
         <TemplateFieldDefaultValue<DGlobalTemplateFieldUpdate>
            name="defaultValue"
            control={control}
         />
         {OPTION_TYPES.includes(type) && (
            <TemplateFieldSelectOptions<DGlobalTemplateFieldUpdate>
               name="options"
               control={control}
            />
         )}
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
