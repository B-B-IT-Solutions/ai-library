"use client";

import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { reduce } from "es-toolkit/compat";
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
   DPromptTemplatingData,
   DPromptVariableValues,
} from "@/data/types/domain/prompt";
import { TemplateEngine } from "@/lib/template";
import { openExternalUrlInNewTab } from "@/lib/utils";
import { PromptPreview } from "../variables/prompt-preview";
import { PromptVariablesForm } from "../variables/prompt-variables-form";
import { buildFieldsSchema } from "../variables/variables.schema";

import { getOtherAiTools, getRecommendedAiTool } from "./ai-services";
import { AiTool } from "./type";
import { requiredVariables, requiredVariablesWithValue } from "./utils";

type Props = {
   promptData: DPromptTemplatingData;
   model?: string;
};

export const UsePromptForm = ({ promptData, model }: Props) => {
   const { prompt, allVariables: variables } = promptData;
   const hasFields = variables.length > 0;

   const fieldsSchema = buildFieldsSchema(variables);

   type DFieldsType = z.infer<typeof fieldsSchema>;

   const form = useForm<DFieldsType>({
      resolver: zodResolver(fieldsSchema),
      defaultValues: reduce(
         variables,
         (acc, field) => ({
            ...acc,
            [field.name]:
               field.defaultValue ?? (field.type === "CHECKBOX" ? false : ""),
         }),
         {}
      ),
      mode: "all",
   });

   const currentValues = useWatch<DFieldsType>({
      control: form.control,
   }) as DPromptVariableValues;

   const resolvedContent = TemplateEngine.replace(
      prompt.content,
      currentValues
   );

   const plainContent = TemplateEngine.stripMarkdown(resolvedContent);

   const recommended = getRecommendedAiTool(model);
   const otherServices = getOtherAiTools(recommended);

   const openInService = useCallback(
      (ai: AiTool) => {
         const targetUrl = `${ai.url}?${ai.queryParam}=${encodeURIComponent(plainContent)}`;
         openExternalUrlInNewTab(targetUrl);
      },
      [plainContent]
   );

   const requiredFields = requiredVariables(variables);
   const requiredFieldsCount = requiredFields.length;

   const requiredFieldWithValue = requiredVariablesWithValue(
      requiredFields,
      currentValues
   );
   const requiredFieldWithValueCount = requiredFieldWithValue.length;

   const showRequiredFieldsProgress = requiredFieldsCount > 0;

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
         {showRequiredFieldsProgress ? (
            <p
               className="text-xs text-muted-foreground"
               data-testid="required-fields-progress"
            >
               {requiredFieldWithValueCount} von {requiredFieldsCount}{" "}
               Pflichtplatzhalter
               {requiredFieldsCount !== 1 ? "n" : ""} ausgefüllt
            </p>
         ) : (
            <span />
         )}
         <div className="flex items-center gap-2">
            <CopyButton
               content={resolvedContent}
               variant="outline"
               size="default"
               type="submit"
               showLabel={true}
               data-testid="copy-prompt-btn"
            />
            <DropdownMenu>
               <DropdownMenuTrigger asChild={true}>
                  <Button
                     type="button"
                     variant="default"
                     size="default"
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
            data-testid="use-prompt-form"
         >
            {hasFields ? (
               <div className="grid min-h-0 flex-1 grid-cols-1 gap-y-5 px-6 lg:min-h-[40vh] lg:grid-cols-2">
                  <div className="flex min-h-0 flex-col gap-3 lg:pr-2">
                     <span className="text-sm font-medium">
                        Platzhalter ausfüllen
                     </span>
                     <div className="min-h-0 flex-1 overflow-y-auto rounded-md border p-4">
                        <PromptVariablesForm
                           templateData={promptData}
                           control={form.control}
                        />
                     </div>
                  </div>
                  <div className="flex min-h-0 flex-col gap-3 lg:pl-2">
                     <span className="text-sm font-medium">Vorschau</span>
                     <PromptPreview
                        template={prompt}
                        values={currentValues}
                        resolvedContent={resolvedContent}
                     />
                  </div>
               </div>
            ) : (
               <div className="flex min-h-0 flex-1 flex-col gap-3 px-6 lg:min-h-[40vh]">
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-medium">Vorschau</span>
                     <div className="h-px flex-1 bg-border" />
                  </div>
                  <PromptPreview
                     template={prompt}
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
