"use client";

import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { filter, isEmpty, reduce } from "es-toolkit/compat";
import { ChevronDown, ExternalLink } from "lucide-react";
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
import { CopyButton } from "@/components/shared/buttons";
import {
   DPromptGenerationData,
   DPromptVariableValues,
} from "@/data/types/domain/prompt";
import { TemplateEngine } from "@/lib/template";
import { openExternalUrlInNewTab } from "@/lib/utils";
import { PromptPreview } from "../variables/prompt-preview";
import { PromptVariablesForm } from "../variables/prompt-variables-form";
import { buildFieldsSchema } from "../variables/variables.schema";

import { getOtherAiTools, getRecommendedAiTool } from "./ai-services";
import { AiTool } from "./type";

type Props = {
   templateData: DPromptGenerationData;
   recommendedModel?: string;
};

export const UseTemplateForm = ({ templateData, recommendedModel }: Props) => {
   const { template, allFields: fields } = templateData;
   const hasFields = fields.length > 0;

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
   }) as DPromptVariableValues;

   const resolvedContent = TemplateEngine.replace(
      template.content,
      currentValues
   );

   const plainContent = TemplateEngine.stripMarkdown(resolvedContent);

   const recommended = getRecommendedAiTool(recommendedModel);
   const otherServices = getOtherAiTools(recommended);

   const openInService = useCallback(
      (ai: AiTool) => {
         const targetUrl = `${ai.url}?${ai.queryParam}=${encodeURIComponent(plainContent)}`;
         openExternalUrlInNewTab(targetUrl);
      },
      [plainContent]
   );

   const requiredFields = filter(fields, (f) => f.required);

   const filledRequiredCount = filter(requiredFields, (f) => {
      const val = currentValues[f.name];
      if (f.type === "CHECKBOX") {
         return val === true;
      }
      return !isEmpty(val);
   }).length;

   const totalRequiredCount = requiredFields.length;

   const showProgress = totalRequiredCount > 0;

   const onSubmitInternal: SubmitHandler<DFieldsType> = () => {};

   const footer = () => (
      <div className="relative flex shrink-0 items-center justify-between gap-2 bg-background px-6 py-4">
         <div
            className="pointer-events-none absolute inset-x-0 -top-8 h-8"
            style={{
               background:
                  "linear-gradient(to bottom, transparent, hsl(var(--background)))",
            }}
         />
         {showProgress ? (
            <p className="text-xs text-muted-foreground">
               {filledRequiredCount} von {totalRequiredCount} Pflichtfeld
               {totalRequiredCount !== 1 ? "ern" : ""} ausgefüllt
            </p>
         ) : (
            <span />
         )}
         <div className="flex items-center gap-2">
            <CopyButton
               content={resolvedContent}
               variant="outline"
               size="sm"
               showLabel={true}
               data-testid="copy-prompt-btn"
            />
            <DropdownMenu>
               <DropdownMenuTrigger asChild={true}>
                  <Button
                     type="button"
                     variant="default"
                     size="sm"
                     className="cursor-pointer gap-1.5"
                     data-testid="open-in-ai-btn"
                  >
                     In KI öffnen
                     <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  {recommended && (
                     <DropdownMenuItem
                        onClick={() => openInService(recommended)}
                        className="cursor-pointer gap-2 font-medium"
                        data-testid={`open-in-${recommended.id}-btn`}
                     >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {recommended.name}
                     </DropdownMenuItem>
                  )}
                  {otherServices.map((aiService) => (
                     <DropdownMenuItem
                        key={aiService.name}
                        onClick={() => openInService(aiService)}
                        className="cursor-pointer gap-2"
                        data-testid={`open-in-${aiService.id}-btn`}
                     >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {aiService.name}
                     </DropdownMenuItem>
                  ))}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   );

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmitInternal)}
            className="flex min-h-0 flex-1 flex-col"
            data-testid="use-template-form"
         >
            {hasFields ? (
               <div className="grid min-h-0 flex-1 grid-cols-1 gap-y-5 px-6 lg:min-h-[40vh] lg:grid-cols-2">
                  <div className="flex min-h-0 flex-col gap-2 lg:pr-2">
                     <p className="text-xs font-medium text-muted-foreground">
                        Platzhalter ausfüllen
                     </p>
                     <div className="min-h-0 flex-1 overflow-y-auto rounded-md border p-4">
                        <PromptVariablesForm
                           templateData={templateData}
                           control={form.control}
                        />
                     </div>
                  </div>
                  <div className="flex min-h-0 flex-col gap-2 lg:pl-2">
                     <p className="text-xs font-medium text-muted-foreground">
                        Vorschau
                     </p>
                     <PromptPreview
                        template={template}
                        values={currentValues}
                        resolvedContent={resolvedContent}
                     />
                  </div>
               </div>
            ) : (
               <div className="flex min-h-0 flex-1 flex-col gap-2 px-6 lg:min-h-[40vh]">
                  <p className="text-xs font-medium text-muted-foreground">
                     Vorschau
                  </p>
                  <PromptPreview
                     template={template}
                     values={currentValues}
                     resolvedContent={resolvedContent}
                  />
               </div>
            )}
            {footer()}
         </form>
      </Form>
   );
};
