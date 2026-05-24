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
            className="cursor-pointer"
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
            <div className="flex items-center justify-between">
               {breadcrumbs()}
               <div className="hidden lg:flex">{actions()}</div>
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
         <div className="flex justify-end lg:hidden">{actions()}</div>
      </ItemDetailsEdit>
   );
};
