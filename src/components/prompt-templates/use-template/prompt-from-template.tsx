"use client";

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
   DPromptTemplateDataPromptGeneration,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";
import { TemplateEngine } from "@/lib/template";
import { openExternalUrlInNewTab } from "@/lib/utils";
import { buildFieldsSchema } from "../fields/fields.schema";
import { TemplateFieldsForm } from "../fields/template-fields-form";
import { TemplatePreview } from "../fields/template-preview";

import {
   getOtherAiTools,
   getRecommendedAiTool as getRecommendedAiTool,
} from "./ai-services";
import { AiTool } from "./type";

type Props = {
   templateData: DPromptTemplateDataPromptGeneration;
   onSubmit: (values: DPromptTemplateFieldValues) => void;
   recommendedModel?: string;
   expanded?: boolean;
};

export const PromptFromTemplate = ({
   templateData,
   onSubmit,
   recommendedModel,
   expanded = false,
}: Props) => {
   const { template, allFields: fields } = templateData;

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

   const plainContent = TemplateEngine.stripMarkdown(resolvedContent);

   const openInService = (ai: AiTool) => {
      const { url, queryParam } = ai;
      const targetUrl = `${url}?${queryParam}=${encodeURIComponent(plainContent)}`;
      openExternalUrlInNewTab(targetUrl);
   };

   const recommended = getRecommendedAiTool(recommendedModel);
   const otherServices = getOtherAiTools(recommended);

   const onSubmitInternal: SubmitHandler<DFieldsType> = (data) => {
      onSubmit(data as DPromptTemplateFieldValues);
   };

   const footer = () => (
      <div className="sticky bottom-0 flex items-center justify-end gap-2 bg-background py-4">
         <CopyButton
            content={resolvedContent}
            size="sm"
            showLabel={true}
            data-testid="copy-prompt-btn"
         />
         <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
               <Button
                  type="button"
                  variant="outline"
                  size="sm"
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
                     className="cursor-pointer gap-2 text-muted-foreground"
                     data-testid={`open-in-${aiService.id}-btn`}
                  >
                     <ExternalLink className="h-3.5 w-3.5" />
                     {aiService.name}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
         <Button
            type="submit"
            size="sm"
            className="cursor-pointer"
            data-testid="submit-btn"
         >
            Prompt erstellen
         </Button>
      </div>
   );

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmitInternal)}
            className={`px-6 ${expanded ? "flex h-full flex-col" : ""}`}
            data-testid="prompt-from-template"
         >
            <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2 ${expanded ? "flex-1" : "lg:min-h-[40vh]"}`}>
               <TemplatePreview
                  template={template}
                  values={currentValues}
                  resolvedContent={resolvedContent}
                  expanded={expanded}
               />
               <TemplateFieldsForm
                  templateData={templateData}
                  control={form.control}
               />
            </div>
            {footer()}
         </form>
      </Form>
   );
};
