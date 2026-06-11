"use client";

import { useMemo, useState } from "react";
import { Loader } from "lucide-react";
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

type Props = {
   prompt?: DPromptWithContent;
   currentCollection?: DCollectionPreview;
   globalFields: DGlobalPromptField[];
};

export const PromptEdit = ({
   prompt,
   currentCollection,
   globalFields,
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

   const submitBtn = () => {
      return (
         <Button
            type="submit"
            form={formId}
            disabled={isSubmitting}
            className="cursor-pointer bg-blue-700 hover:bg-blue-800"
            data-testid="save-btn"
         >
            {isSubmitting ? (
               <>
                  <Loader className="h-4 w-4 animate-spin" />
                  {isEdit ? "Wird gespeichert..." : "Wird erstellt..."}
               </>
            ) : (
               <>{isEdit ? "Prompt speichern" : "Prompt erstellen"}</>
            )}
         </Button>
      );
   };

   const actions = () => {
      return (
         <div className="flex items-center gap-2">
            {cancelBtn()}
            {submitBtn()}
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
