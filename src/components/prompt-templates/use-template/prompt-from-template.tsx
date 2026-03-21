"use client";

import { FC, useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { reduce } from "es-toolkit/compat";
import { Check, ChevronDown, Copy, ExternalLink } from "lucide-react";
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
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";
import { buildFieldsSchema } from "../fields/fields.schema";
import { TemplateFieldForm } from "../fields/template-fields-form_0";
import { TemplatePreview } from "../fields/template-preview";

const AI_SERVICES: {
   name: string;
   url: string;
   queryParam?: string;
   keywords: string[];
}[] = [
   {
      name: "ChatGPT",
      url: "https://chatgpt.com/",
      queryParam: "q",
      keywords: ["chatgpt", "gpt", "openai"],
   },
   {
      name: "Claude",
      url: "https://claude.ai/new",
      queryParam: "q",
      keywords: ["claude", "anthropic"],
   },
   {
      name: "Gemini",
      url: "https://gemini.google.com/app",
      keywords: ["gemini", "google"],
   },
   {
      name: "Perplexity",
      url: "https://www.perplexity.ai/",
      queryParam: "q",
      keywords: ["perplexity"],
   },
];

const getRecommendedService = (recommendedModel?: string) => {
   if (!recommendedModel) return null;
   const lower = recommendedModel.toLowerCase();
   return (
      AI_SERVICES.find((s) => s.keywords.some((kw) => lower.includes(kw))) ??
      null
   );
};

type Props = {
   templateData: DPromptTemplateDataPromptGeneration;
   onSubmit: (values: DPromptTemplateFieldValues) => void;
   onCancel: CallbackFn;
   recommendedModel?: string;
};

export const PromptFromTemplate: FC<Props> = ({
   templateData,
   onSubmit,
   recommendedModel,
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

   const resolvedContent = TemplateEngine.replace(
      template.content,
      currentValues
   );

   const copyToClipboard = useCallback(async () => {
      await navigator.clipboard.writeText(resolvedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   }, [resolvedContent]);

   const plainContent = TemplateEngine.stripMarkdown(resolvedContent);

   const openInService = useCallback(
      async (url: string, queryParam?: string) => {
         let targetUrl = url;
         if (queryParam) {
            targetUrl = `${url}?${queryParam}=${encodeURIComponent(plainContent)}`;
         } else {
            await navigator.clipboard.writeText(plainContent);
         }
         window.open(targetUrl, "_blank", "noopener,noreferrer");
      },
      [plainContent]
   );

   const recommended = getRecommendedService(recommendedModel);
   const otherServices = AI_SERVICES.filter(
      (s) => s.name !== recommended?.name
   );

   const onSubmitInternal: SubmitHandler<DFieldsType> = (data) => {
      onSubmit(data as DPromptTemplateFieldValues);
   };

   const preview = () => (
      <div className="flex flex-col gap-2">
         <div className="group relative max-h-[65vh] flex-1 overflow-y-auto rounded-md border bg-muted/30 p-4">
            <Button
               type="button"
               variant="secondary"
               size="icon"
               onClick={copyToClipboard}
               className="absolute top-2 right-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
               data-testid="copy-btn"
            >
               {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
               ) : (
                  <Copy className="h-3.5 w-3.5" />
               )}
            </Button>
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

   const footer = () => (
      <div className="sticky bottom-0 -mx-6 mt-6 flex items-center justify-end gap-2 border-t bg-background px-6 py-4">
         <Button
            type="button"
            variant="outline"
            onClick={copyToClipboard}
            className="cursor-pointer gap-1.5"
            data-testid="copy-btn"
         >
            {copied ? (
               <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Kopiert!</span>
               </>
            ) : (
               <>
                  <Copy className="h-4 w-4" />
                  Kopieren
               </>
            )}
         </Button>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer gap-1.5"
                  data-testid="open-in-ai-btn"
               >
                  <ExternalLink className="h-4 w-4" />
                  Anwenden
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               {recommended && (
                  <DropdownMenuItem
                     onClick={() =>
                        openInService(recommended.url, recommended.queryParam)
                     }
                     className="cursor-pointer gap-2 font-medium"
                     data-testid={`open-in-${recommended.name.toLowerCase()}-btn`}
                  >
                     <ExternalLink className="h-3.5 w-3.5" />
                     {recommended.name}
                  </DropdownMenuItem>
               )}
               {otherServices.map((service) => (
                  <DropdownMenuItem
                     key={service.name}
                     onClick={() =>
                        openInService(service.url, service.queryParam)
                     }
                     className="cursor-pointer gap-2 text-muted-foreground"
                     data-testid={`open-in-${service.name.toLowerCase()}-btn`}
                  >
                     <ExternalLink className="h-3.5 w-3.5" />
                     {service.name}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
         <Button
            type="submit"
            className="cursor-pointer"
            data-testid="submit-btn"
         >
            Prompt erstellen
         </Button>
      </div>
   );

   return (
      <div data-testid="prompt-from-tempalte">
         <div className="grid grid-cols-1 gap-6 lg:min-h-[40vh] lg:grid-cols-2">
            {preview()}
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmitInternal)}>
                  <TemplateFieldForm
                     templateData={templateData}
                     control={form.control}
                  />
               </form>
            </Form>
         </div>
         {footer()}
      </div>
   );
};
