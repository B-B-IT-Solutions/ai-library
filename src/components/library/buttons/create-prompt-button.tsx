"use client";

import { FC, useState, useTransition } from "react";
import { isEmpty } from "es-toolkit/compat";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";

import { CreatePromptDialog } from "@/components/prompts";
import { Button } from "@/components/shadcn/button";
import { composePromptFromTemplate } from "@/data/actions/library";
import { getPromptTemplate } from "@/data/actions/prompt";
import { getGlobalTemplateFields } from "@/data/actions/settings";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplate,
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { cn } from "@/lib/utils";

type Props = {
   descriptor: DPromptTemplateDescriptor;
   className?: string;
};

type Mode = "fields-form" | "review";

export const CreatePromptButton: FC<Props> = ({ descriptor, className }) => {
   const [isPending, startTransition] = useTransition();
   const [mode, setMode] = useState<Mode | null>(null);
   const [promptTemplate, setPromptTemplate] = useState<DPromptTemplate | null>(
      null
   );
   const [generatedPrompt, setGeneratedPrompt] = useState<DPromptUpdate | null>(
      null
   );
   const [globalFields, setGlobalFields] = useState<DGlobalTemplateField[]>(
      []
   );

   const handleCreate = async () => {
      startTransition(async () => {
         const template = await getPromptTemplate(descriptor.promptTemplateId);

         const { fields, globalFieldIds } = template || {};
         const hasFields = !isEmpty(fields) || !isEmpty(globalFieldIds);

         if (hasFields) {
            if (!isEmpty(globalFieldIds)) {
               const allGlobalFields = await getGlobalTemplateFields();
               const filtered = allGlobalFields.filter((f) =>
                  globalFieldIds!.includes(f.id)
               );
               const sorted = [...filtered].sort(
                  (a, b) =>
                     globalFieldIds!.indexOf(a.id) -
                     globalFieldIds!.indexOf(b.id)
               );
               setGlobalFields(sorted);
            } else {
               setGlobalFields([]);
            }
            setPromptTemplate(template);
            setMode("fields-form");
         } else {
            await composePrompt({});
         }
      });
   };

   const handleCancel = () => {
      setMode(null);
      setGeneratedPrompt(null);
      setGlobalFields([]);
   };

   const composePrompt = async (values: DPromptTemplateFieldValues) => {
      startTransition(async () => {
         const result = await composePromptFromTemplate(descriptor.id, values);
         if (result.success && result.data) {
            setMode("review");
            setGeneratedPrompt(result.data);
         } else {
            toast.error(result.message);
         }
      });
   };

   const dialog = () => {
      if (mode === "review" && generatedPrompt) {
         return (
            <CreatePromptDialog
               onSubmit={composePrompt}
               onCancel={handleCancel}
               mode="review"
               promptUpdate={generatedPrompt}
            />
         );
      }
      if (mode === "fields-form" && descriptor) {
         const tempalte = promptTemplate as DPromptTemplate;
         const desc: DPromptTemplateDescriptorWithTemplate = {
            ...descriptor,
            promptTemplate: tempalte,
         };
         return (
            <CreatePromptDialog
               onSubmit={composePrompt}
               onCancel={handleCancel}
               mode="fields-form"
               descriptor={desc}
               globalFields={globalFields}
            />
         );
      }
   };

   const label = () => {
      if (isPending) {
         return (
            <>
               <Loader className="mr-1.5 h-4 w-4 animate-spin" />
               <span>Erstellen...</span>
            </>
         );
      }

      return (
         <>
            <Plus className="mr-1.5 h-4 w-4" />
            <span>Prompt erstellen</span>
         </>
      );
   };

   return (
      <>
         <Button
            variant="default"
            size="sm"
            onClick={handleCreate}
            disabled={isPending}
            className={cn(
               "cursor-pointer bg-blue-600 text-white hover:bg-blue-700",
               className
            )}
            data-testid="create-prompt-btn"
         >
            {label()}
         </Button>
         {dialog()}
      </>
   );
};
