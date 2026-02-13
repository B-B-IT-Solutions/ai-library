"use client";

import { FC } from "react";
import { AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { Control } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";

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

type FormData = {
   fields: Array<{
      name: string;
      label: string;
      description?: string;
      type: string;
      required: boolean;
      order: number;
      defaultValue?: string;
      options?: string[];
   }>;
};

type Props = {
   control: Control<FormData>;
   index: number;
   isUsedInContent: boolean;
   hasName: boolean;
   onRemove: () => void;
};

export const PromptTemplateField: FC<Props> = ({
   control,
   index,
   isUsedInContent,
   hasName,
   onRemove,
}) => {
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
            <Button type="button" onClick={onRemove} variant="ghost" size="sm">
               <Trash2 className="h-4 w-4" />
            </Button>
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
         <div className="grid grid-cols-2 gap-4">
            <FormField
               control={control}
               name={`fields.${index}.name`}
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Feldname *</FormLabel>
                     <FormControl>
                        <Input {...field} placeholder="z.B. thema" />
                     </FormControl>
                     <p className="mt-1 text-xs text-slate-500">
                        Verwenden Sie diesen Namen als{" "}
                        {`{{${field.value || "feldname"}}}`}
                     </p>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={control}
               name={`fields.${index}.label`}
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Label *</FormLabel>
                     <FormControl>
                        <Input {...field} placeholder="z.B. Thema" />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={control}
               name={`fields.${index}.type`}
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Feldtyp *</FormLabel>
                     <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                           <SelectTrigger>
                              <SelectValue />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {FIELD_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                 {type.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={control}
               name={`fields.${index}.defaultValue`}
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Standardwert</FormLabel>
                     <FormControl>
                        <Input {...field} placeholder="Optional" />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={control}
               name={`fields.${index}.description`}
               render={({ field }) => (
                  <FormItem className="col-span-2">
                     <FormLabel>Beschreibung</FormLabel>
                     <FormControl>
                        <Textarea
                           {...field}
                           placeholder="Optionale Beschreibung für das Feld"
                           rows={2}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={control}
               name={`fields.${index}.required`}
               render={({ field }) => (
                  <FormItem className="col-span-2 flex items-center space-y-0 space-x-2">
                     <FormControl>
                        <Checkbox
                           checked={field.value}
                           onCheckedChange={field.onChange}
                        />
                     </FormControl>
                     <FormLabel className="cursor-pointer font-normal">
                        Dieses Feld ist erforderlich
                     </FormLabel>
                  </FormItem>
               )}
            />
         </div>
      </div>
   );
};
