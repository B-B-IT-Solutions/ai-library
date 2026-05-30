"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { viewPromptUrl } from "@/components/prompts/utils";
import { Form } from "@/components/shadcn/form";
import { createPrompt, updatePrompt } from "@/data/actions/prompt";
import { DCollection } from "@/data/types/domain/collection";
import {
   DPromptUpdate,
   DPromptUpdateCrate,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { updateTemplateSchema } from "@/data/types/validators/template";

import { BasicInfo } from "./sections";
import { PromptFormTabs } from "./tabs";
import { initPromptTemplate } from "./utils";

type Props = {
   prompt?: DPromptWithContent;
   collection?: DCollection;
   globalFields: DGlobalPromptField[];
   onSubmit: (isSubmiting: boolean) => void;
};

export const PromptEditForm = ({
   prompt,
   collection,
   globalFields,
   onSubmit: onSubmittingChange,
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

   const onSubmit: SubmitHandler<DPromptUpdate> = async (data) => {
      if (isEdit) {
         const result = await updatePrompt(prompt.id, data);
         if (result.success) {
            toast.success(result.message);
            const viewUrl = viewPromptUrl(prompt, collection?.id);
            router.push(viewUrl);
         } else {
            toast.error(result.message);
         }
      } else {
         const crate: DPromptUpdateCrate = {
            data,
            collectionId: collection?.id,
         };
         const result = await createPrompt(crate);
         if (result.success) {
            toast.success(result.message);
            const viewUrl = viewPromptUrl(result.data!, collection?.id);
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
               id="prompt-edit-form"
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
                     onToggleExpand={() => setIsEditorExpanded((v) => !v)}
                  />
               </div>
            </form>
         </Form>
      </div>
   );
};
