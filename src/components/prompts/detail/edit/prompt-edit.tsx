"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Form } from "@/components/shadcn/form";
import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { createPrompt, updatePrompt } from "@/data/actions/prompt";
import { DCollectionPreview } from "@/data/types/domain/collection";
import {
   DPromptUpdate,
   DPromptUpdateCrate,
   DPromptUpdateOptions,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { updatePromptSchema } from "@/data/types/validators/prompt";
import { PromptBreadcrumb } from "../../breadcrumbs";
import {
   isEditMode,
   promptEditNavigateBackUrl,
   viewPromptUrl,
} from "../../utils";

import { PromptEditForm } from "./form/prompt-form";
import { initPromptTemplate } from "./form/utils";
import { PromptSaveSplitButton } from "./prompt-save-split-button";

type Props = {
   prompt?: DPromptWithContent;
   currentCollection?: DCollectionPreview;
   globalFields: DGlobalPromptField[];
   /**
    * Whether the current user's plan allows creating a prompt content
    * version (`canAccessVersionHistory` tier feature). Defaults to `false`
    * (safe/locked) so existing callers that don't pass it keep the "Speichern
    * als neue Version" option visible-but-disabled, matching the FREE tier
    * behaviour (see feature spec §5.1).
    */
   canAccessVersionHistory?: boolean;
};

export const PromptEdit = ({
   prompt,
   currentCollection,
   globalFields,
   canAccessVersionHistory = false,
}: Props) => {
   const router = useRouter();

   const isEdit = useMemo(() => isEditMode(prompt), [prompt]);

   const backUrl = useMemo(
      () => promptEditNavigateBackUrl(prompt, currentCollection),
      [prompt, currentCollection]
   );

   // `useForm` (and the buttons that trigger it) live here rather than in
   // `PromptEditForm` so that the header/footer save buttons — which sit
   // outside the `<form>` element's DOM subtree (see prompt-edit's layout) —
   // can drive submission directly via `form.handleSubmit(...)`, without a
   // hidden mirror submit button or reading `event.nativeEvent.submitter`.
   const form = useForm<DPromptUpdate>({
      resolver: zodResolver(updatePromptSchema),
      defaultValues: initPromptTemplate(prompt),
      mode: "onBlur",
   });

   const { isSubmitting } = form.formState;
   const [versionNote, setVersionNote] = useState("");

   const handleSave = async (data: DPromptUpdate, saveAsVersion: boolean) => {
      const versionOptions: DPromptUpdateOptions | undefined =
         isEdit && saveAsVersion
            ? { saveAsVersion: true, versionNote: versionNote || undefined }
            : undefined;

      if (isEdit && prompt) {
         const result = await updatePrompt(prompt.id, data, versionOptions);
         if (result.success) {
            toast.success(result.message);
            const viewUrl = viewPromptUrl(prompt, currentCollection);
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

   // Both wrap the exact same validation/submit pipeline — only whether a
   // version snapshot is taken first (a call-behavior, not a field of the
   // prompt, see DPromptUpdateOptions) differs.
   const handleSaveNormal = form.handleSubmit((data) =>
      handleSave(data, false)
   );
   const handleSaveAsVersion = form.handleSubmit((data) =>
      handleSave(data, true)
   );

   const breadcrumbs = () => {
      if (prompt) {
         return (
            <PromptBreadcrumb
               variant="edit"
               prompt={prompt}
               currentCollection={currentCollection}
            />
         );
      }
      return (
         <PromptBreadcrumb
            variant="new"
            currentCollection={currentCollection}
         />
      );
   };

   const cancelBtn = () => {
      return (
         <Button
            asChild={true}
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="cursor-pointer"
            data-testid="cancel-btn"
         >
            <Link href={backUrl}>Abbrechen</Link>
         </Button>
      );
   };

   const saveBtn = () => {
      return (
         <PromptSaveSplitButton
            isEdit={isEdit}
            isSubmitting={isSubmitting}
            canAccessVersionHistory={canAccessVersionHistory}
            onSave={handleSaveNormal}
            onSaveAsVersion={handleSaveAsVersion}
         />
      );
   };

   const actions = () => {
      return (
         <div className="flex items-center gap-2">
            {cancelBtn()}
            {saveBtn()}
         </div>
      );
   };

   return (
      <Form {...form}>
         <ItemDetailsEdit data-testid="prompt-edit">
            <ItemDetailsEditHeader>
               {breadcrumbs()}
               <div
                  className="ml-auto hidden lg:flex"
                  data-testid="header-actions"
               >
                  {actions()}
               </div>
            </ItemDetailsEditHeader>
            <ItemDetailsEditContent>
               <ItemDetailsEditBody>
                  <PromptEditForm
                     form={form}
                     globalFields={globalFields}
                     isEdit={isEdit}
                     versionNote={versionNote}
                     onVersionNoteChange={setVersionNote}
                     onSubmit={handleSaveNormal}
                  />
               </ItemDetailsEditBody>
            </ItemDetailsEditContent>
            {/* Mobile-only action buttons */}
            <div
               className="flex justify-end border-t border-slate-200 bg-white px-6 py-3 lg:hidden"
               data-testid="footer-actions"
            >
               {actions()}
            </div>
         </ItemDetailsEdit>
      </Form>
   );
};
