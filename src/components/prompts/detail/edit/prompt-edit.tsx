"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { DCollectionPreview } from "@/data/types/domain/collection";
import { DPromptWithContent } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { PromptBreadcrumb } from "../../breadcrumbs";
import { isEditMode, promptEditNavigateBackUrl } from "../../utils";

import { PromptEditForm } from "./form/prompt-form";
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
   const [isSubmitting, setIsSubmitting] = useState(false);

   const isEdit = useMemo(() => isEditMode(prompt), [prompt]);

   const backUrl = useMemo(
      () => promptEditNavigateBackUrl(prompt, currentCollection),
      [prompt, currentCollection]
   );

   const formId = "prompt-edit-form";

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
            formId={formId}
            isEdit={isEdit}
            isSubmitting={isSubmitting}
            canAccessVersionHistory={canAccessVersionHistory}
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
                  prompt={prompt}
                  currentCollection={currentCollection}
                  globalFields={globalFields}
                  onSubmit={setIsSubmitting}
                  formId={formId}
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
   );
};
