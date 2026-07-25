"use client";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { viewPromptUrl } from "@/components/prompts/utils";
import { Form } from "@/components/shadcn/form";
import { createPrompt, updatePrompt } from "@/data/actions/prompt";
import { DCollectionPreview } from "@/data/types/domain/collection";
import {
   DPromptUpdate,
   DPromptUpdateCrate,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { updateTemplateSchema } from "@/data/types/validators/prompt";

import { BasicInfo } from "./sections";
import { PromptFormTabs } from "./tabs";
import { initPromptTemplate } from "./utils";

type Props = {
   prompt?: DPromptWithContent;
   currentCollection?: DCollectionPreview;
   globalFields: DGlobalPromptField[];
   onSubmit: (isSubmiting: boolean) => void;
   formId?: string;
};

export const PromptEditForm = ({
   prompt,
   currentCollection,
   globalFields,
   onSubmit: onSubmittingChange,
   formId = "prompt-edit-form",
}: Props) => {
   const router = useRouter();
   const isEdit = !!prompt;

   const form = useForm<DPromptUpdate>({
      resolver: zodResolver(updateTemplateSchema),
      defaultValues: initPromptTemplate(prompt),
      mode: "onBlur",
   });

   const { isSubmitting } = form.formState;
   const [isEditorExpanded, setIsEditorExpanded] = useState(false);

   useEffect(() => {
      onSubmittingChange?.(isSubmitting);
   }, [isSubmitting, onSubmittingChange]);

   const toggleExpanded = useCallback(() => {
      setIsEditorExpanded((value) => !value);
   }, []);

   const onSubmit: SubmitHandler<DPromptUpdate> = async (data) => {
      if (isEdit) {
         const result = await updatePrompt(prompt.id, data);
         if (result.success) {
            toast.success(result.message);
            const viewUrl = viewPromptUrl(prompt, currentCollection);
            router.push(viewUrl);
         } else {
            toast.error(result.message);
         }
      } else {
         const crate: DPromptUpdateCrate = {
            data,
            collectionId: currentCollection?.id,
         };
         const result = await createPrompt(crate);
         if (result.success) {
            toast.success(result.message);
            const viewUrl = viewPromptUrl(result.data!, currentCollection);
            router.push(viewUrl);
         } else if (result.upgradeRequired) {
            toast.error(result.message, {
               action: {
                  label: "Upgrade",
                  onClick: () => router.push("/subscription/pricing"),
               },
            });
         } else {
            toast.error(result.message);
         }
      }
   };

   return (
      <div data-testid="prompt-edit-form" className="space-y-4">
         <Form {...form}>
            <form
               id={formId}
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-4"
            >
               {!isEditorExpanded && (
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                     <BasicInfo control={form.control} />
                  </div>
               )}
               <div className="rounded-xl bg-white p-6 shadow-sm">
                  <PromptFormTabs
                     form={form}
                     globalFields={globalFields}
                     isEditorExpanded={isEditorExpanded}
                     onToggleExpand={toggleExpanded}
                  />
               </div>
            </form>
         </Form>
      </div>
   );
};
