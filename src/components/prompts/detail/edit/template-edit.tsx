"use client";

import { useState } from "react";
import { Loader } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   ItemDetailsEdit,
   ItemDetailsEditBody,
   ItemDetailsEditContent,
   ItemDetailsEditHeader,
} from "@/components/shared/wrappers/item-details";
import { DPromptWithContent } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { TemplateBreadcrumb } from "../../breadcrumbs";

import { TemplateEditForm } from "./template-edit-form";

type Props = {
   prompt?: DPromptWithContent;
   collectionId?: string;
   globalFields: DGlobalPromptField[];
};

export const TemplateEdit = ({ prompt, collectionId, globalFields }: Props) => {
   const [isSubmitting, setIsSubmitting] = useState(false);

   const isEdit = !!prompt;

   const cancelHref = isEdit
      ? `/templates/${prompt!.id}`
      : collectionId
        ? `/collections/${collectionId}`
        : "/templates";

   const breadcrumbs = () => {
      if (prompt) {
         return (
            <TemplateBreadcrumb
               variant="edit"
               label={prompt.title}
               entryId={prompt.id}
            />
         );
      }
      return <TemplateBreadcrumb variant="new" />;
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
            <Link href={cancelHref}>Abbrechen</Link>
         </Button>
      );
   };

   const submitBtn = () => {
      return (
         <Button
            type="submit"
            form="template-edit-form"
            disabled={isSubmitting}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700"
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
      <ItemDetailsEdit data-testid="template-edit">
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
               <TemplateEditForm
                  prompt={prompt}
                  collectionId={collectionId}
                  globalFields={globalFields}
                  onSubmit={setIsSubmitting}
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
