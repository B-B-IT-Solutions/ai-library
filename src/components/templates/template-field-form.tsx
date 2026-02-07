"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
   Form,
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
import {
   DPromptTemplateField,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";

type Props = {
   fields: DPromptTemplateField[];
   onSubmit: (values: DPromptTemplateFieldValues) => void;
   onCancel?: () => void;
};

export const TemplateFieldForm = ({ fields, onSubmit, onCancel }: Props) => {
   const buildSchema = () => {
      const shape: Record<string, any> = {};
      fields.forEach((field) => {
         let validator: any;

         switch (field.type) {
            case "EMAIL":
               validator = z.string().email("Ungültige E-Mail");
               break;
            case "NUMBER":
               validator = z.coerce.number();
               break;
            case "DATE":
               validator = z.string(); // Or z.date() depending on input format
               break;
            case "CHECKBOX":
               validator = z.boolean().default(false);
               break;
            default:
               validator = z.string();
         }

         if (field.required && field.type !== "CHECKBOX") {
            validator = validator.min(1, `${field.label} ist erforderlich`);
         } else if (!field.required) {
            validator = validator.optional();
         }

         shape[field.name] = validator;
      });

      return z.object(shape);
   };

   const form = useForm<any>({
      resolver: zodResolver(buildSchema()),
      defaultValues: fields.reduce(
         (acc, field) => ({
            ...acc,
            [field.name]:
               field.defaultValue ?? (field.type === "CHECKBOX" ? false : ""),
         }),
         {}
      ),
   });

   const renderField = (field: DPromptTemplateField) => {
      switch (field.type) {
         case "TEXTAREA":
            return (
               <FormField
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                     <FormItem>
                        <FormLabel>
                           {field.label} {field.required && "*"}
                        </FormLabel>
                        {field.description && (
                           <p className="text-sm text-muted-foreground">
                              {field.description}
                           </p>
                        )}
                        <FormControl>
                           <Textarea {...formField} rows={4} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            );

         case "SELECT":
            return (
               <FormField
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                     <FormItem>
                        <FormLabel>
                           {field.label} {field.required && "*"}
                        </FormLabel>
                        {field.description && (
                           <p className="text-sm text-muted-foreground">
                              {field.description}
                           </p>
                        )}
                        <Select
                           onValueChange={formField.onChange}
                           defaultValue={formField.value}
                        >
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue placeholder="Auswählen..." />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              {field.options?.map((option) => (
                                 <SelectItem key={option} value={option}>
                                    {option}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            );

         case "RADIO":
            // Use Select for RADIO since RadioGroup component doesn't exist
            return (
               <FormField
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                     <FormItem>
                        <FormLabel>
                           {field.label} {field.required && "*"}
                        </FormLabel>
                        {field.description && (
                           <p className="text-sm text-muted-foreground">
                              {field.description}
                           </p>
                        )}
                        <Select
                           onValueChange={formField.onChange}
                           defaultValue={formField.value}
                        >
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue placeholder="Auswählen..." />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              {field.options?.map((option) => (
                                 <SelectItem key={option} value={option}>
                                    {option}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            );

         case "CHECKBOX":
            return (
               <FormField
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                     <FormItem className="flex items-center space-x-2">
                        <FormControl>
                           <Checkbox
                              checked={formField.value}
                              onCheckedChange={formField.onChange}
                           />
                        </FormControl>
                        <FormLabel className="!mt-0">{field.label}</FormLabel>
                        {field.description && (
                           <p className="text-sm text-muted-foreground">
                              {field.description}
                           </p>
                        )}
                        <FormMessage />
                     </FormItem>
                  )}
               />
            );

         case "NUMBER":
         case "DATE":
         case "EMAIL":
         case "TEXT":
         default:
            return (
               <FormField
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                     <FormItem>
                        <FormLabel>
                           {field.label} {field.required && "*"}
                        </FormLabel>
                        {field.description && (
                           <p className="text-sm text-muted-foreground">
                              {field.description}
                           </p>
                        )}
                        <FormControl>
                           <Input
                              type={field.type.toLowerCase()}
                              {...formField}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            );
      }
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
               <div key={field.id}>{renderField(field)}</div>
            ))}

            <div className="flex justify-end gap-2">
               {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                     Abbrechen
                  </Button>
               )}
               <Button type="submit">Vorschau generieren</Button>
            </div>
         </form>
      </Form>
   );
};
