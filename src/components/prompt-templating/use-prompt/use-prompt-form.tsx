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
   DPromptFieldValues,
   DPromptGenerationData,
} from "@/data/types/domain/prompt";
import { TemplateEngine } from "@/lib/template";
import { openExternalUrlInNewTab } from "@/lib/utils";
import { PromptPreview } from "../variables/prompt-preview";
import { PromptVariablesForm } from "../variables/prompt-variables-form";
import { buildFieldsSchema } from "../variables/variables.schema";

import {
   getOtherAiTools,
   getRecommendedAiTool as getRecommendedAiTool,
} from "./ai-services";
import { AiTool } from "./type";

type Props = {
   templateData: DPromptGenerationData;
   recommendedModel?: string;
};

export const UseTemplateForm = ({ templateData, recommendedModel }: Props) => {
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
   }) as DPromptFieldValues;

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

   const onSubmitInternal: SubmitHandler<DFieldsType> = (data) => {};

   const footer = () => (
      <div className="flex shrink-0 items-center justify-end gap-2 bg-background px-6 py-4">
         <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
               <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer gap-1.5"
                  data-testid="open-in-ai-btn"
               >
                  Öffnen In
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
                     className="cursor-pointer gap-2"
                     data-testid={`open-in-${aiService.id}-btn`}
                  >
                     <ExternalLink className="h-3.5 w-3.5" />
                     {aiService.name}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
         <CopyButton
            content={resolvedContent}
            type="submit"
            size="sm"
            showLabel={true}
            data-testid="copy-prompt-btn"
         />
      </div>
   );

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmitInternal)}
            className="flex min-h-0 flex-1 flex-col"
            data-testid="use-template-form"
         >
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-y-5 px-6 lg:min-h-[40vh] lg:grid-cols-2">
               <div className="flex min-h-0 flex-col gap-2 lg:pr-2">
                  <p className="text-xs font-medium text-muted-foreground">
                     Vorschau
                  </p>
                  <PromptPreview
                     template={template}
                     values={currentValues}
                     resolvedContent={resolvedContent}
                  />
               </div>
               <div className="flex min-h-0 flex-col gap-2 lg:pl-2">
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
            </div>
            {footer()}
         </form>
      </Form>
   );
};
