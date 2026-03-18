"use client";

import { FC, useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { map, reduce } from "es-toolkit/compat";
import { Check, ChevronDown, Clipboard, ExternalLink } from "lucide-react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/shadcn/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Form } from "@/components/shadcn/form";
import { TemplateEngine } from "@/data/services/prompt-template/template.engine";
import { CallbackFn } from "@/data/types/common";
import {
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateField,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";

import { CheckBoxField } from "./field/field-check-box";
import { GenericField } from "./field/field-generic";
import { RadioField } from "./field/field-radio";
import { SelectField } from "./field/field-select";
import { TextAreaField } from "./field/field-textarea";
import { buildFieldsSchema } from "./fields.schema";
import { TemplatePreview } from "./template-preview";

const AI_SERVICES: {
   name: string;
   url: string;
   queryParam?: string;
}[] = [
   { name: "ChatGPT", url: "https://chatgpt.com/", queryParam: "q" },
   { name: "Claude", url: "https://claude.ai/new" },
   { name: "Gemini", url: "https://gemini.google.com/app" },
   { name: "Perplexity", url: "https://www.perplexity.ai/", queryParam: "q" },
];

type Props = {
   templateData: DPromptTemplateDataPromptGeneration;
   onSubmit: (values: DPromptTemplateFieldValues) => void;
   onCancel: CallbackFn;
};

export const TemplateFieldForm: FC<Props> = ({
   templateData,
   onSubmit,
   onCancel,
}) => {
   const { template, allFields: fields } = templateData;
   const [copied, setCopied] = useState(false);

   const fieldsSchema = buildFieldsSchema(fields);

   type DFieldsType = z.infer<typeof fieldsSchema>;

   const form = useForm<DFieldsType>({
      resolver: zodResolver(fieldsSchema),
      defaultValues: reduce(
         fields,
         (acc, field) => ({
            ...acc,
            [field.name]:
               field.defaultValue ?? (field.type === "CHECKBOX" ? false : ""),
         }),
         {}
      ),
   });

   const currentValues = useWatch<DFieldsType>({
      control: form.control,
   }) as DPromptTemplateFieldValues;

   const renderField = (field: DPromptTemplateField) => {
      switch (field.type) {
         case "TEXTAREA":
            return <TextAreaField field={field} control={form.control} />;
         case "SELECT":
            return <SelectField field={field} control={form.control} />;
         case "RADIO":
            return <RadioField field={field} control={form.control} />;
         case "CHECKBOX":
            return <CheckBoxField field={field} control={form.control} />;
         case "NUMBER":
         case "DATE":
         case "EMAIL":
         case "TEXT":
            return <GenericField field={field} control={form.control} />;
      }
   };

   const renderFields = () => {
      return map(fields, (field) => {
         return <div key={field.id}>{renderField(field)}</div>;
      });
   };

   const onSubmitInternal: SubmitHandler<DFieldsType> = (data) => {
      onSubmit(data as DPromptTemplateFieldValues);
   };

   const resolvedContent = TemplateEngine.replace(
      template.content,
      currentValues
   );

   const copyToClipboard = useCallback(async () => {
      await navigator.clipboard.writeText(resolvedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   }, [resolvedContent]);

   const openInService = useCallback(
      async (url: string, queryParam?: string) => {
         let targetUrl = url;
         if (queryParam) {
            targetUrl = `${url}?${queryParam}=${encodeURIComponent(resolvedContent)}`;
         } else {
            await navigator.clipboard.writeText(resolvedContent);
         }
         window.open(targetUrl, "_blank", "noopener,noreferrer");
      },
      [resolvedContent]
   );

   const preview = () => {
      return (
         <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
               <span className="text-sm font-medium text-muted-foreground">
                  Vorschau
               </span>
               <div className="flex items-center gap-1">
                  <Button
                     type="button"
                     variant="ghost"
                     size="sm"
                     onClick={copyToClipboard}
                     className="h-8 gap-1.5 px-2 text-xs"
                     data-testid="copy-btn"
                  >
                     {copied ? (
                        <>
                           <Check className="h-3.5 w-3.5 text-green-600" />
                           <span className="text-green-600">Kopiert!</span>
                        </>
                     ) : (
                        <>
                           <Clipboard className="h-3.5 w-3.5" />
                           Kopieren
                        </>
                     )}
                  </Button>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           className="h-8 gap-1.5 px-2 text-xs"
                           data-testid="open-in-ai-btn"
                        >
                           <ExternalLink className="h-3.5 w-3.5" />
                           Öffnen in
                           <ChevronDown className="h-3 w-3 opacity-60" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        {AI_SERVICES.map((service) => (
                           <DropdownMenuItem
                              key={service.name}
                              onClick={() =>
                                 openInService(service.url, service.queryParam)
                              }
                              className="cursor-pointer gap-2"
                           >
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="flex-1">{service.name}</span>
                              {!service.queryParam && (
                                 <span className="text-[10px] text-muted-foreground">
                                    Einfügen nötig
                                 </span>
                              )}
                           </DropdownMenuItem>
                        ))}
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
            <div className="max-h-[60vh] flex-1 overflow-y-auto rounded-md border bg-muted/30 p-4">
               <TemplatePreview template={template} values={currentValues} />
            </div>
            <p className="text-xs text-muted-foreground">
               <span className="mr-1 inline-block rounded bg-orange-100 px-1 text-orange-700 italic">
                  {"{{platzhalter}}"}
               </span>
               noch nicht ausgefüllt ·{" "}
               <span className="mr-1 inline-block rounded bg-green-100 px-1 font-medium text-green-800">
                  wert
               </span>
               ausgefüllt
            </p>
         </div>
      );
   };

   const fieldInputs = () => (
      <div className="flex flex-col justify-between">
         <div className="space-y-4">{renderFields()}</div>
         <div className="flex justify-end gap-2 pt-2">
            <Button
               type="button"
               variant="outline"
               onClick={onCancel}
               className="cursor-pointer"
               data-testid="cancel-btn"
            >
               Abbrechen
            </Button>
            <Button
               type="submit"
               className="cursor-pointer"
               data-testid="submit-btn"
            >
               Vorschau generieren
            </Button>
         </div>
      </div>
   );

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmitInternal)}
            data-testid="template-fields-form"
         >
            <div className="grid grid-cols-1 gap-6 lg:min-h-[40vh] lg:grid-cols-2">
               {preview()}
               {fieldInputs()}
            </div>
         </form>
      </Form>
   );
};
